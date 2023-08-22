import { LoginData } from '~/features/Login/pages/LoginCandidate'
import client from './client'

export class auth {
  public static loginApi = async (data: LoginData) => {
    return client.post('/api/v1/auth/authenticate', data)
  }
}
//phong_lo
export default auth
