import { JwtPayload } from 'jwt-decode'
export interface ApiResponse {
  message: string
  result:
    | any[]
    | {
        [key: string]: any
      }
    | any
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

export interface RoomType {
  _id: string
  last_conversation: {
    [key: string]: any
  }
  user: {
    _id: string
    name: string
    email: string
    username: string
    avatar: string
    cover_photo: string
  }
  company: {
    [key: string]: any
  }
}

export interface ConversationType {
  _id: string
  sender_id: string
  content: string
  created_at: string
  updated_at: string
  room_id: string
}

export interface ChatType {
  conversations: ConversationType[]
  total: number
  limit: number
  page: number
  infor_receiver: any
}
