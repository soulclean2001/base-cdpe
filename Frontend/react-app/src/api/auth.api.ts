import { LoginData } from '~/features/JobSeeker/pages/LoginJobSeeker'
import client, { cancelTokenSource } from './client'

interface AuthResponse {
  message: string
  result: {
    access_token?: string
    refresh_token?: string
  }
}
export class Auth {
  public static loginApi = async (data: LoginData): Promise<AuthResponse> => {
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
