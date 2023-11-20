import { ObjectId } from 'mongodb'
import { Gender, UserRole, UserVerifyStatus } from '~/constants/enums'

enum UserStatus {
  Available,
  Blocked
}

interface UserType {
  _id?: ObjectId
  name: string
  email: string
  password: string
  username?: string
  date_of_birth: Date
  email_verify_token?: string
  forgot_password_token?: string
  verify?: UserVerifyStatus
  avatar?: string
  cover_photo?: string
  role?: UserRole
  phone_number?: string
  gender?: Gender
  created_at?: Date
  updated_at?: Date
  status?: UserStatus
}

export default class User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  username: string
  date_of_birth: Date
  email_verify_token: string
  forgot_password_token: string
  verify: UserVerifyStatus
  avatar: string
  cover_photo: string
  role: UserRole
  phone_number: string
  gender: Gender
  created_at: Date
  updated_at: Date
  status: UserStatus

  constructor(user: UserType) {
    const date = new Date()
    this._id = user._id
    this.name = user.name || ''
    this.email = user.email
    this.password = user.password
    this.username = user.username || ''
    this.date_of_birth = user.date_of_birth || date
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || UserVerifyStatus.Unverified
    this.avatar = user.avatar || ''
    this.cover_photo = user.cover_photo || ''

    this.role = this.isIn(UserRole, user.role) ? (user.role as number) : UserRole.Candidate
    this.phone_number = user.phone_number || ''
    this.status = user.status || UserStatus.Available
  }

  private isIn<T, V>(object: T, value: V): boolean {
    return Object.values(object as any).includes(value)
  }
}
