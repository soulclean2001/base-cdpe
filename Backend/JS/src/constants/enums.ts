export enum UserVerifyStatus {
  Unverified,
  Verified,
  Banned
}

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
