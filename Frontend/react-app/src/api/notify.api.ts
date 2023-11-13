import { ApiResponse } from '~/types'
import client from './client'
export interface RequestNotify {
  filter: {
    page?: string
    limit?: string
  }
}
export class Notify {
  public static getAllByMe = async (request: RequestNotify) => {
    const rs: ApiResponse = await client.get(`/notifications`, { params: request })
    return rs
  }
  public static seeNotify = async (id: string) => {
    const rs: ApiResponse = await client.post(`/notifications/${id}`)
    return rs
  }
  public static getTotalUnRead = async () => {
    const rs: ApiResponse = await client.get(`/notifications/total-unread`)
    return rs
  }
}

export default Notify
