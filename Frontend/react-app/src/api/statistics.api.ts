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
    const rs: ApiResponse = await client.get(`/admin/summary`, { params: filter })
    return rs
  }
  public static getSales = async (request: RequestOverview) => {
    let filter = filterObject(request)
    const rs: ApiResponse = await client.get(`/admin/sales`, { params: filter })
    return rs
  }
  public static getTop10RankCompanyMostOrders = async (request: RequestOverview) => {
    let filter = filterObject(request)
    const rs: ApiResponse = await client.get(`/admin/top10orders`, { params: filter })
    return rs
  }
  public static getTop10RankCompanyMostJobs = async (request: RequestOverview) => {
    let filter = filterObject(request)
    const rs: ApiResponse = await client.get(`/admin/top10jobs`, { params: filter })
    return rs
  }
  //
  //for employer
  public static getSalesByEmployer = async (request: RequestOverview) => {
    let filter = filterObject(request)
    const rs: ApiResponse = await client.get(`/company/sales`, { params: filter })
    return rs
  }
  public static getTotalJobs = async (is_publish?: number) => {
    // param 1 or undefined
    const rs: ApiResponse = await client.get(`/company/total-jobs`, { params: { is_publish } })
    return rs
  }
  public static getTop10JobsMostAppli = async () => {
    const rs: ApiResponse = await client.get(`/company/top-10-jobs-has-the-most-applications`)
    return rs
  }
  //
}

export default Resume
