import jwt from 'jsonwebtoken'
import { TokenPayload } from '~/models/requests/User.request'

export const signToken = ({
  payload,
  privateKey = '12344321!@#' as string,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  privateKey?: string
  options?: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    return jwt.sign(payload, privateKey, options, (err, result) => {
      if (err) throw reject(err)
      return resolve(result as string)
    })
  })
}

export const verifyToken = ({ token, secretOrPublicKey }: { token: string; secretOrPublicKey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) {
        throw reject(error)
      }
      resolve(decoded as TokenPayload)
    })
  })
}
