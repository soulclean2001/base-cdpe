import usersService from '~/services/users.services'
import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  LoginReqBody,
  LogoutReqBody,
  RefreshTokenReqBody,
  RegisterReqBody,
  TokenPayload
} from '~/models/requests/User.request'
import { USERS_MESSAGES } from '~/constants/messages'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/User.schema'
import { UserRole } from '~/constants/enums'

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
}

export default new AuthController()
