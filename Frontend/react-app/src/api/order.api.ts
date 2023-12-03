import { ApiResponse } from '~/types'
import client from './client'
import { filterObject } from '~/utils/filterRequestDynamic'

export interface RequestOrderType {
  items: {
    item_id: string
    quantity: number
  }[]
}
export interface RequestSearchOrderType {
  status?: string
  limit?: string
  page?: string
  sort_by_date?: string
}
export class Order {
  public static getAllByMe = async (request: RequestSearchOrderType) => {
    let filter = filterObject(request)
    const rs: ApiResponse = await client.get(`/orders`, { params: filter })
    return rs
  }
  public static getDetailOrder = async (id: string) => {
    const rs: ApiResponse = await client.get(`/orders/${id}`)
    return rs
  }
  public static postOrder = async (data: RequestOrderType) => {
    const rs: ApiResponse = await client.post(`/orders`, data)
    return rs
  }
}

export default Order
