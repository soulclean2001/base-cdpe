// @ts-ignore
import jwt_decode, { JwtPayload } from 'jwt-decode'
import { TokenPayload } from '~/types'

export const decodeToken = async (token: string): Promise<TokenPayload> => {
  return new Promise((resolve, reject) => {
    try {
      const result = jwt_decode<TokenPayload>(token)
      resolve(result)
    } catch (error) {
      return reject(error)
    }
  })
}

export const isExpired = (token: string) => {
  try {
    const result = jwt_decode(token) as JwtPayload
    result.exp
    if (Date.now() >= (result.exp as number) * 1000) {
      return true
    }
  } catch (error) {
    return false
  }

  return false
}
