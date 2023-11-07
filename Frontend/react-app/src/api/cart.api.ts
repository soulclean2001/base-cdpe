import { ApiResponse } from '~/types'
import client from './client'

export interface ItemType {
  quantity: number
  item_id: string
}

export interface ItemCartRequestType {
  item: ItemType
}
export class Cart {
  public static getAllByMe = async () => {
    const rs: ApiResponse = await client.get(`/carts/items`)
    return rs
  }
  public static getMyCart = async () => {
    const rs: ApiResponse = await client.post(`/carts`)
    return rs
  }
  public static getItemById = async (id: string) => {
    const rs: ApiResponse = await client.get(`/carts/items/${id}`)
    return rs
  }
  public static createOrUpdateItemCart = async (data: ItemCartRequestType) => {
    const rs: ApiResponse = await client.post(`/carts/items`, data)
    return rs
  }
  public static deleteIemCart = async (id: string) => {
    const rs: ApiResponse = await client.delete(`/carts/items/${id}`)
    return rs
  }
}

export default Cart
