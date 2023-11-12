import { ApiResponse } from '~/types'
import client from './client'

export class Notify {
  public static getAllByMe = async () => {
    const rs: ApiResponse = await client.get(`/notifications`)
    return rs
  }
  public static seeNotify = async (id: string) => {
    const rs: ApiResponse = await client.post(`/notifications/${id}`)
    return rs
  }
}

export default Notify
