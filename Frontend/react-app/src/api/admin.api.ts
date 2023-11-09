import { ApiResponse } from '~/types'
import client from './client'
import { filterObject } from '~/utils/filterRequestDynamic'
import { RequestSearchOrderType } from './order.api'
export interface JobSearchByAdmin {
  content?: string
  from_day?: string
  to_day?: string
  status?: string
  limit?: string
  page?: string
}
export interface OrderSearchByAdmin {
  status?: string
  limit?: string
  page?: string
  sort_by_date?: string
}
export class Admin {
  public static getAllPostRequest = async (param: JobSearchByAdmin) => {
    let request = filterObject(param)
    const rs: ApiResponse = await client.get(`/admin/posts`, { params: request })
    return rs
  }
  public static postApprovePostRequest = async (id: string) => {
    const rs: ApiResponse = await client.post(`/jobs/${id}/approve`)
    return rs
  }

  public static postRejectPostRequest = async (id: string) => {
    const rs: ApiResponse = await client.post(`/jobs/${id}/reject`)
    return rs
  }
  public static getAllOrders = async (param: RequestSearchOrderType) => {
    let request = filterObject(param)
    const rs: ApiResponse = await client.get(`/admin/orders`, { params: request })
    return rs
  }
  public static getDetailOrderById = async (id: string) => {
    const rs: ApiResponse = await client.get(`/admin/orders/${id}`)
    return rs
  }
  public static activeService = async (id: string) => {
    const rs: ApiResponse = await client.get(`/orders/active-order/${id}`)
    return rs
  }
  public static activeServicesByOrderId = async (order_id: string) => {
    const rs: ApiResponse = await client.post(`/orders/active-order`, { order_id })
    return rs
  }
}

export default Admin
