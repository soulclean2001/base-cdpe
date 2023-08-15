import databaseServices from './database.services'
import User from '~/models/schemas/User.schema'
import { RegisterReqBody } from '~/models/requests/User.request'
import { hashPassword } from '~/utils/crypto'
import { signToken, verifyToken } from '~/utils/jwt'
import { TokenType, UserRole, UserVerifyStatus } from '~/constants/enums'
import { envConfig } from '~/constants/config'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'

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

    const [access_token, refresh_token] = await this.signTokenKeyPair({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified,
      role: UserRole.Candidate
    })
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)
    await databaseServices.refreshTokens.insertOne(new RefreshToken({ user_id, token: refresh_token, iat, exp }))

    // Flow verify email
    // 1. Server send email to user
    // 2. User click link in email
    // 3. Client send request to server with email_verify_token
    // 4. Server verify email_verify_token
    // 5. Client receive access_token and refresh_token
    // await sendVerifyRegisterEmail(payload.email, email_verify_token)
    console.log('gửi email verification email:', email_verify_token)

    return {
      access_token,
      refresh_token
    }
  }

  async checkEmailExist(email: string) {
    const user = await databaseServices.users.findOne({ email })
    return Boolean(user)
  }

  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [access_token, refresh_token] = await this.signTokenKeyPair({ user_id, verify, role: UserRole.Candidate })
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)
    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token, iat, exp })
    )
    return {
      access_token,
      refresh_token
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
    exp,
    role
  }: {
    user_id: string
    verify: UserVerifyStatus
    refresh_token: string
    exp: number
    role: UserRole
  }) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify, role }),
      this.signRefreshToken({ user_id, verify, exp }),
      databaseServices.refreshTokens.deleteOne({ token: refresh_token })
    ])

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

  // async resendVerifyEmail(user_id: string, email: string) {
  //   const email_verify_token = await this.signEmailVerifyToken({
  //     user_id,
  //     verify: UserVerifyStatus.Unverified
  //   })
  //   await sendVerifyRegisterEmail(email, email_verify_token)

  //   // Cập nhật lại giá trị email_verify_token trong document user
  //   await databaseService.users.updateOne(
  //     { _id: new ObjectId(user_id) },
  //     {
  //       $set: {
  //         email_verify_token
  //       },
  //       $currentDate: {
  //         updated_at: true
  //       }
  //     }
  //   )
  //   return {
  //     message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS
  //   }
  // }
}

export default new UsersService()
