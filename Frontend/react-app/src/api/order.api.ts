import { ApiResponse } from '~/types'
import client from './client'

export interface RequestOrderType {
  items: {
    item_id: string
    quantity: number
  }[]
}

export class Order {
  public static getAllByMe = async () => {
    const rs: ApiResponse = await client.get(`/orders`)
    return rs
  }
  public static postOrder = async (data: RequestOrderType) => {
    const rs: ApiResponse = await client.post(`/orders`, data)
    return rs
  }
}

export default Order
