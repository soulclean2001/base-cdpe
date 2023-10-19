import { WorkingLocation } from '~/features/Employer/pages/Dashboard/pages/CompanyManagePage/CompanyManagePage'
import client, { cancelTokenSource } from './client'

interface AuthResponse {
  message: string
  result: {
    access_token?: string
    refresh_token?: string
  }
}

export interface AuthRequestRegistry {
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
  role: number
  name: string
  gender: number
  phone_number?: string
  company_name?: string
  position?: string
  fields?: string[]
  working_locations?: WorkingLocation[]
}
export class Auth {
  public static register = async (data: AuthRequestRegistry): Promise<AuthResponse> => {
    return client.post('/users/register', data)
  }
  public static loginApi = async (data: {
    username: string
    password: string
    role: number
  }): Promise<AuthResponse> => {
    return client.post('/users/login', {
      ...data,
      email: data.username
    })
  }

  public static refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
    return client.post('/users/refresh-token', { refresh_token: refreshToken })
  }

  public static verifyEmail = async (token: string): Promise<AuthResponse> => {
    return client.post(
      '/users/verify-email',
      {
        email_verify_token: token
      },
      {
        cancelToken: cancelTokenSource.token
      }
    )
  }

  // nhap email gui ve email click verify
  public static forgotPassword = async (email: string) => {
    return client.post('/users/forgot-password', {
      email
    })
  }

  // khi click vao verify trong email
  public static verifyForgotPassword = async (token: string): Promise<AuthResponse> => {
    return client.post(
      '/users/verify-forgot-password',
      {
        forgot_password_token: token
      },
      {
        cancelToken: cancelTokenSource.token
      }
    )
  }

  public static resetPassword = async ({
    password,
    confirm_password,
    forgot_password_token
  }: {
    password: string
    confirm_password: string
    forgot_password_token: string
  }) => {
    return client.post('/users/reset-password', {
      password,
      confirm_password,
      forgot_password_token
    })
  }
}
//phong_lo
export default Auth
