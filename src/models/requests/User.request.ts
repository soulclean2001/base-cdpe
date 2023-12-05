import { JwtPayload } from 'jsonwebtoken'
import { Gender, TokenType, UserRole, UserVerifyStatus } from '~/constants/enums'
import { ParamsDictionary } from 'express-serve-static-core'
import { WorkingLocation } from '../schemas/Job.schema'

export interface UpdateMeReqBody {
  name?: string
  date_of_birth?: string
  username?: string
  avatar?: string
  cover_photo?: string
  position?: string
  gender?: number
  company_name?: string
  phone_number?: string
}
export interface ChangePasswordReqBody {
  old_password: string
  password: string
  confirm_password: string
}
export interface FollowReqBody {
  followed_user_id: string
}

export interface LoginReqBody {
  email: string
  password: string
}

export interface VerifyEmailReqBody {
  email_verify_token: string
}

export interface GetProfileReqParams extends ParamsDictionary {
  username: string
}

export interface UnfollowReqParams extends ParamsDictionary {
  user_id: string
}

export interface ResetPasswordReqBody {
  password: string
  confirm_password: string
  forgot_password_token: string
}

export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
  role: UserRole
  phone_number?: string
  gender?: Gender
  company_name?: string
  position?: string
  fields?: string[]
  working_locations?: WorkingLocation[]
}

export interface LogoutReqBody {
  refresh_token: string
}

export interface RefreshTokenReqBody {
  refresh_token: string
}

export interface ForgotPasswordReqBody {
  email: string
}

export interface VerifyForgotPasswordReqBody {
  forgot_password_token: string
}
export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  role: UserRole
  verify: UserVerifyStatus
  exp: number
  iat: number
}
