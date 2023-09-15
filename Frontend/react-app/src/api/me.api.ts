import { ApiResponse } from '~/types'
import client from './client'
export class Me {
  public static getMe = async () => {
    const rs: ApiResponse = await client.get(`/users/me`)
    return rs
  }
}

export default Me
