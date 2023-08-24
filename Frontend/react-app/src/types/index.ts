import { JwtPayload } from 'jwt-decode'

export enum UserRole {
  Administrators,
  Employer,
  Candidate
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  role: UserRole
  verify: UserVerifyStatus
  exp: number
  iat: number
}

export enum UserVerifyStatus {
  Unverified,
  Verified,
  Banned
}
