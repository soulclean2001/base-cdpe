import usersService from '~/services/users.services'
import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  ChangePasswordReqBody,
  ForgotPasswordReqBody,
  GetProfileReqParams,
  LoginReqBody,
  LogoutReqBody,
  RefreshTokenReqBody,
  RegisterReqBody,
  ResetPasswordReqBody,
  TokenPayload,
  UpdateMeReqBody,
  VerifyEmailReqBody,
  VerifyForgotPasswordReqBody
} from '~/models/requests/User.request'
import { USERS_MESSAGES } from '~/constants/messages'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/User.schema'
import { UserRole, UserVerifyStatus } from '~/constants/enums'
import databaseServices from '~/services/database.services'
import HTTP_STATUS from '~/constants/httpStatus'
import { envConfig } from '~/constants/config'

class AuthController {
  public async login(req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) {
    const user = req.user as User
    const user_id = user._id as ObjectId
    const result = await usersService.login({ user_id: user_id.toString(), verify: user.verify })
    return res.json({
      message: USERS_MESSAGES.LOGIN_SUCCESS,
      result
    })
  }

  public async oauth(req: Request, res: Response) {
    const { code } = req.query
    const { access_token, refresh_token, verify, newUser } = await usersService.oauth(code as string)
    const urlRedirect = `${envConfig.clientRedirectCallback}?access_token=${access_token}&refresh_token=${refresh_token}&verify=${verify}&new_user=${newUser}`
    return res.redirect(urlRedirect)
  }

  public async register(req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response, next: NextFunction) {
    const result = await usersService.register(req.body)
    return res.json({
      message: USERS_MESSAGES.REGISTER_SUCCESS,
      result
    })
  }

  public async logout(req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response, next: NextFunction) {
    const { refresh_token } = req.body
    const result = await usersService.logout(refresh_token)
    return res.json(result)
  }

  public async refreshToken(
    req: Request<ParamsDictionary, any, RefreshTokenReqBody>,
    res: Response,
    next: NextFunction
  ) {
    const { refresh_token } = req.body
    const { user_id, verify, exp, role } = req.decoded_refresh_token as TokenPayload
    const result = await usersService.refreshToken({ user_id, verify, refresh_token, exp, role })
    return res.json({
      message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
      result
    })
  }

  public async verifyEmail(req: Request<ParamsDictionary, any, VerifyEmailReqBody>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_email_verify_token as TokenPayload
    const user = await databaseServices.users.findOne({
      _id: new ObjectId(user_id)
    })
    // Nếu không tìm thấy user thì mình sẽ báo lỗi
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: USERS_MESSAGES.USER_NOT_FOUND
      })
    }
    // Đã verify rồi thì mình sẽ không báo lỗi
    // Mà mình sẽ trả về status OK với message là đã verify trước đó rồi
    if (user.email_verify_token === '') {
      return res.json({
        message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
      })
    }
    const result = await usersService.verifyEmail(user_id)
    return res.json({
      message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
      result
    })
  }

  public async resendVerifyEmail(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: USERS_MESSAGES.USER_NOT_FOUND
      })
    }

    if (user.verify === UserVerifyStatus.Verified) {
      return res.json({
        message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
      })
    }

    const result = await usersService.resendVerifyEmail(user_id, user.email)
    return res.json(result)
  }

  public async forgotPassword(
    req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
    res: Response,
    next: NextFunction
  ) {
    const { _id, verify, email } = req.user as User
    const result = await usersService.forgotPassword({ user_id: (_id as ObjectId).toString(), verify, email })

    return res.json(result)
  }

  public async verifyForgotPassword(
    req: Request<ParamsDictionary, any, VerifyForgotPasswordReqBody>,
    res: Response,
    next: NextFunction
  ) {
    return res.json({
      message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
    })
  }

  public async resetPassword(
    req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
    res: Response,
    next: NextFunction
  ) {
    const { user_id } = req.decoded_forgot_password_token as TokenPayload
    const { password } = req.body
    const result = await usersService.resetPassword({ user_id, password })

    return res.json(result)
  }

  public async getMe(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as TokenPayload

    const result = await usersService.getMe(user_id)
    return res.json({
      message: USERS_MESSAGES.GET_ME_SUCCESS,
      result
    })
  }

  public async getProfile(req: Request<GetProfileReqParams>, res: Response, next: NextFunction) {
    const { username } = req.params

    const result = await usersService.getProfile(username)
    return res.json({
      message: USERS_MESSAGES.GET_PROFILE_SUCCESS,
      result
    })
  }

  public async updateMe(req: Request<ParamsDictionary, any, UpdateMeReqBody>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { body } = req
    const result = await usersService.updateMe(user_id, body)

    return res.json({
      message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
      result
    })
  }

  public async changePassword(
    req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
    res: Response,
    next: NextFunction
  ) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { password } = req.body
    const result = await usersService.changePassword(user_id, password)
    return res.json(result)
  }
}

export default new AuthController()
