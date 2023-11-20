export enum UserVerifyStatus {
  Unverified,
  Verified,
  Banned
}

export enum Gender {
  Male,
  Female,
  Other
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

export enum MediaType {
  Image,
  Video,
  HLS,
  PDF
}

export enum MediaTypeQuery {
  Image = 'image',
  Video = 'video'
}

export enum EncodingStatus {
  Pending, // Đang chờ ở hàng đợi (chưa được encode)
  Processing, // Đang encode
  Success, // Encode thành công
  Failed // Encode thất bại
}

export enum PackageType {
  'POST' = 'POST',
  'BANNER' = 'BANNER'
}
