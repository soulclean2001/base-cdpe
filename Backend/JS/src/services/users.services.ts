import databaseServices from './database.services'
import User from '~/models/schemas/User.schema'
import { RegisterReqBody, UpdateMeReqBody } from '~/models/requests/User.request'
import { hashPassword } from '~/utils/crypto'
import { signToken, verifyToken } from '~/utils/jwt'
import { TokenType, UserRole, UserVerifyStatus } from '~/constants/enums'
import { envConfig } from '~/constants/config'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import { isNumber, omit } from 'lodash'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import axios from 'axios'
import { sendVerifyRegisterEmail, sendForgotPasswordEmail } from '~/utils/email'
import Company from '~/models/schemas/Company.schema'
import { PositionType } from '~/models/requests/Company.request'

export interface QueryUserEmployerFilter {
  content?: string
  verify?: string
  status?: string
  limit?: string
  page?: string
  type?: 'employer' | 'admin' | 'candidate' | 'all'
}

class UsersService {
  private signAccessToken({ user_id, verify, role }: { user_id: string; verify: UserVerifyStatus; role: UserRole }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
        role,
        verify
      },
      privateKey: envConfig.jwtSecretAccessToken,
      options: {
        expiresIn: envConfig.accessTokenExpiresIn
      }
    })
  }

  private signRefreshToken({ user_id, verify, exp }: { user_id: string; verify: UserVerifyStatus; exp?: number }) {
    if (exp) {
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.RefreshToken,
          verify,
          exp
        },
        privateKey: envConfig.jwtSecretRefreshToken
      })
    }
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        verify
      },
      privateKey: envConfig.jwtSecretRefreshToken,
      options: {
        expiresIn: envConfig.refreshTokenExpiresIn
      }
    })
  }

  private signTokenKeyPair({ user_id, verify, role }: { user_id: string; verify: UserVerifyStatus; role: UserRole }) {
    return Promise.all([this.signAccessToken({ user_id, verify, role }), this.signRefreshToken({ user_id, verify })])
  }

  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: envConfig.jwtSecretRefreshToken
    })
  }

  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.EmailVerifyToken,
        verify
      },
      privateKey: envConfig.jwtSecretEmailVerifyToken,
      options: {
        expiresIn: envConfig.emailVerifyTokenExpiresIn
      }
    })
  }

  private signForgotPasswordToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.ForgotPasswordToken,
        verify
      },
      privateKey: envConfig.jwtSecretForgotPasswordToken,
      options: {
        expiresIn: envConfig.forgotPasswordTokenExpiresIn
      }
    })
  }

  public async register(payload: RegisterReqBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    await databaseServices.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        username: `user${user_id.toString()}`,
        email_verify_token,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )

    if (payload.role === UserRole.Employer) {
      await databaseServices.company.insertOne(
        new Company({
          company_name: payload.company_name as string,
          fields: payload.fields || [],
          working_locations: payload.working_locations || [],
          users: [
            {
              user_id,
              position: PositionType.Admin
            }
          ]
        })
      )
    }

    const [access_token, refresh_token] = await this.signTokenKeyPair({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified,
      role: payload.role || UserRole.Candidate
    })
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)
    await databaseServices.refreshTokens.insertOne(new RefreshToken({ user_id, token: refresh_token, iat, exp }))

    // Flow verify email
    // 1. Server send email to user
    // 2. User click link in email
    // 3. Client send request to server with email_verify_token
    // 4. Server verify email_verify_token
    // 5. Client receive access_token and refresh_token
    // console.log('gửi token verification email:', email_verify_token)
    // await sendVerifyRegisterEmail(payload.email, email_verify_token)

    return {
      access_token,
      refresh_token
    }
  }

  private async getGoogleUserInfo(id_token: string, access_token: string) {
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      params: {
        access_token,
        alt: 'json'
      },
      headers: {
        Authorization: `Bearer ${id_token}`
      }
    })

    return data as {
      id: string
      email: string
      verified_email: boolean
      name: string
      given_name: string
      family_name: string
      picture: string
      locale: string
    }
  }

  async checkEmailExist(email: string) {
    const user = await databaseServices.users.findOne({ email })
    return Boolean(user)
  }

  async login({ user_id, verify, role }: { user_id: string; verify: UserVerifyStatus; role: UserRole }) {
    const [access_token, refresh_token] = await this.signTokenKeyPair({ user_id, verify, role })
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)
    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token, iat, exp })
    )

    return {
      access_token,
      refresh_token
    }
  }

  async oauth(code: string) {
    const { id_token, access_token } = await this.getOauthGoogleToken(code)
    const userInfo = await this.getGoogleUserInfo(id_token, access_token)
    if (!userInfo.verified_email) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.GMAIL_NOT_VERIFIED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const user = await databaseServices.users.findOne({ email: userInfo.email })
    if (user) {
      const [access_token, refresh_token] = await this.signTokenKeyPair({
        user_id: user._id.toString(),
        verify: user.verify,
        role: user.role
      })
      const { iat, exp } = await this.decodeRefreshToken(refresh_token)
      await databaseServices.refreshTokens.insertOne(
        new RefreshToken({ user_id: user._id, token: refresh_token, iat, exp })
      )
      return {
        access_token,
        refresh_token,
        verify: user.verify,
        newUser: 0
      }
    } else {
      const password = Math.random().toString(36).substring(2, 15)

      const result = await this.register({
        email: userInfo.email,
        password,
        date_of_birth: new Date().toISOString(),
        confirm_password: password,
        name: userInfo.name,
        role: UserRole.Candidate
      })

      const { iat, exp, user_id } = await this.decodeRefreshToken(result.refresh_token)
      await databaseServices.refreshTokens.insertOne(
        new RefreshToken({ user_id: new ObjectId(user_id), token: result.refresh_token, iat, exp })
      )

      return {
        ...result,
        verify: UserVerifyStatus.Unverified,
        newUser: 1
      }
    }
  }

  async getOauthGoogleToken(code: string) {
    const body = {
      code,
      client_id: envConfig.googleClientId,
      client_secret: envConfig.googleClientSecret,
      redirect_uri: envConfig.googleRedirectUri,
      grant_type: 'authorization_code'
    }

    const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    return data as {
      id_token: string
      access_token: string
    }
  }

  async logout(refresh_token: string) {
    const result = await databaseServices.refreshTokens.deleteOne({ token: refresh_token })
    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESS
    }
  }

  async refreshToken({
    user_id,
    verify,
    refresh_token,
    exp
  }: {
    user_id: string
    verify: UserVerifyStatus
    refresh_token: string
    exp: number
  }) {
    const user = await databaseServices.users.findOne({
      _id: new ObjectId(user_id)
    })

    if (!user)
      throw new ErrorWithStatus({
        message: 'User not found',
        status: 404
      })

    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify, role: user.role }),
      this.signRefreshToken({ user_id, verify, exp })
    ])

    await databaseServices.refreshTokens.deleteOne({ token: refresh_token })
    const decoded_refresh_token = await this.decodeRefreshToken(new_refresh_token)
    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: new_refresh_token,
        iat: decoded_refresh_token.iat,
        exp: decoded_refresh_token.exp
      })
    )

    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  }

  async verifyEmail(user_id: string) {
    const [token] = await Promise.all([
      this.signTokenKeyPair({ user_id, verify: UserVerifyStatus.Verified, role: UserRole.Candidate }),
      databaseServices.users.updateOne({ _id: new ObjectId(user_id) }, [
        {
          $set: {
            email_verify_token: '',
            verify: UserVerifyStatus.Verified,
            updated_at: '$$NOW'
          }
        }
      ])
    ])
    const [access_token, refresh_token] = token
    const decoded_refresh_token = await this.decodeRefreshToken(refresh_token)
    const { iat, exp } = decoded_refresh_token
    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        iat,
        exp,
        user_id: new ObjectId(user_id)
      })
    )

    return { access_token, refresh_token }
  }

  async resendVerifyEmail(user_id: string, email: string) {
    const email_verify_token = await this.signEmailVerifyToken({ user_id, verify: UserVerifyStatus.Unverified })
    await sendVerifyRegisterEmail(email, email_verify_token)

    await databaseServices.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token: email_verify_token
        },
        $currentDate: {
          updated_at: true
        }
      }
    )

    return {
      message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS
    }
  }

  async forgotPassword({ user_id, verify, email }: { user_id: string; verify: UserVerifyStatus; email: string }) {
    const forgot_password_token = await this.signForgotPasswordToken({ user_id, verify })
    await databaseServices.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      [
        {
          $set: {
            forgot_password_token,
            updated_at: '$$NOW'
          }
        }
      ]
    )

    await sendForgotPasswordEmail(email, forgot_password_token)

    return {
      message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
    }
  }

  async resetPassword({ user_id, password }: { user_id: string; password: string }) {
    await databaseServices.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          password: hashPassword(password),
          forgot_password_token: ''
        },
        $currentDate: {
          updated_at: true
        }
      }
    )

    return {
      message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS
    }
  }

  async getMe(user_id: string) {
    const user = await databaseServices.users.findOne({
      _id: new ObjectId(user_id)
    })
    return omit(user, ['password', 'forgot_password_token', 'email_verify_token'])
  }

  async getProfile(username: string) {
    const user = await databaseServices.users.findOne({
      username
    })
    if (!user)
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })

    return omit(user, [
      'password',
      'forgot_password_token',
      'email_verify_token',
      'verify',
      'created_at',
      'updated_at',
      'role'
    ])
  }

  async updateMe(user_id: string, payload: UpdateMeReqBody) {
    const _payload = payload.date_of_birth ? { ...payload, date_of_birth: new Date(payload.date_of_birth) } : payload
    const user = await databaseServices.users.findOneAndUpdate(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          ...(_payload as UpdateMeReqBody & { date_of_birth?: Date })
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )

    return omit(user.value, ['password', 'forgot_password_token', 'email_verify_token'])
  }

  async changePassword(user_id: string, password: string) {
    await databaseServices.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          password: hashPassword(password)
        },
        $currentDate: {
          updated_at: true
        }
      }
    )

    return {
      message: USERS_MESSAGES.CHANGE_PASSWORD_SUCCESS
    }
  }

  async userFollowResume(resumeId: string, recruiterId: string) {
    const result = await databaseServices.recruiterFollowedResumes.insertOne({
      resume_id: new ObjectId(resumeId),
      recruiter_id: new ObjectId(recruiterId)
    })
    return result
  }

  async unfollowResume(resumeId: string, recruiterId: string) {
    const result = await databaseServices.recruiterFollowedResumes.findOneAndDelete({
      resume_id: new ObjectId(resumeId),
      recruiter_id: new ObjectId(recruiterId)
    })
    return result
  }

  async userFollowCompany(userId: string, companyId: string) {
    const result = await databaseServices.companyFollowers.insertOne({
      company_id: new ObjectId(companyId),
      user_id: new ObjectId(userId)
    })
    return result
  }

  async unfollowCompany(userId: string, companyId: string) {
    const result = await databaseServices.companyFollowers.findOneAndDelete({
      company_id: new ObjectId(companyId),
      user_id: new ObjectId(userId)
    })
    return result
  }

  async getUsersFromAdmin(filter: QueryUserEmployerFilter) {
    const limit = Number(filter.limit) || 10
    const page = Number(filter.page) || 1

    const opts = this.queryUserEmployerConvertToMatch(filter) || {}

    console.log(opts)

    const [employers, total] = await Promise.all([
      databaseServices.users
        .aggregate([
          {
            $match: {
              ...opts
            }
          },
          {
            $project: {
              password: 0,
              email_verify_token: 0,
              forgot_password_token: 0
            }
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseServices.users
        .aggregate([
          {
            $match: {
              role: UserRole.Employer,
              ...opts
            }
          },

          {
            $count: 'total'
          }
        ])
        .toArray()
    ])

    return {
      employers,
      total: total[0]?.total || 0,
      limit,
      page
    }
  }

  queryUserEmployerConvertToMatch(query: QueryUserEmployerFilter) {
    const options: {
      [key: string]: any
    } = {}
    if (query.content) {
      options['$text'] = {
        $search: query.content
      }
    }

    if (query.status && isNumber(Number(query.status))) {
      options['status'] = Number(query.status)
    }

    if (query.verify && isNumber(Number(query.verify))) {
      options['verify'] = Number(query.verify)
    }

    if (query.type) {
      if (query.type === 'admin') options['role'] = UserRole.Administrators
      if (query.type === 'candidate') options['role'] = UserRole.Candidate
      if (query.type === 'employer') options['role'] = UserRole.Employer
    }
    return options
  }
}

export default new UsersService()
