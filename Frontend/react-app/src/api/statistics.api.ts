import { ApiResponse } from '~/types'
import client from './client'

import { filterObject } from '~/utils/filterRequestDynamic'
export interface RequestOverview {
  month?: number | string
  year?: number | string
}
export class Resume {
  //for admin
  public static getSumary = async (request: RequestOverview) => {
    let filter = filterObject(request)
    const rs: ApiResponse = await client.get(`/admin/sumany`, { params: filter })
    return rs
  }
  public static getSales = async (request: RequestOverview) => {
    let filter = filterObject(request)
    const rs: ApiResponse = await client.get(`/admin/sales`, { params: filter })
    return rs
  }
  //
}

export default Resume
