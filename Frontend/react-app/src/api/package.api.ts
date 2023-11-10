import { ApiResponse } from '~/types'
import client from './client'

import { filterObject } from '~/utils/filterRequestDynamic'
export interface RequestFilterPackageOwnByMe {
  title?: string
  status?: number | string
  from_date?: string
  to_date?: string
  limit?: string
  page?: string
}
export interface RequestFilterPackageType {
  type?: string
  title?: string
  limit?: string
  page?: string
}
export interface CreatePackageReqBody {
  type: string
  price: number
  title: string
  description: string
  includes: string
  code?: string
  preview?: string[]
  discount_price?: number
  number_of_days_to_expire: number | string
  value?: number | string
}
export interface UpdatePackageReqBody {
  price?: number
  title?: string
  description?: string
  includes?: string
  code?: string
  discount_price?: number
  preview?: string[]
  number_of_days_to_expire?: number | string
  value?: number | string
}
export class Package {
  //using for employ
  public static getAllPackageForEmployClient = async (request: RequestFilterPackageType) => {
    // let filter = filterObject(request)
    const rs: ApiResponse = await client.get(`/packages/get-by-filter`, { params: request })
    return rs
  }
  public static getAllPackageByMe = async (request: RequestFilterPackageOwnByMe) => {
    let filter = filterObject(request)
    const rs: ApiResponse = await client.get(`/packages/me`, { params: filter })
    return rs
  }
  public static getDetailById = async (id: string) => {
    // let filter = filterObject(request)
    const rs: ApiResponse = await client.get(`/packages/${id}`)
    return rs
  }
  //using for ADMIN
  public static getAllPackageForAdmin = async () => {
    const rs: ApiResponse = await client.get(`/packages`)
    return rs
  }
  public static createPackage = async (data: CreatePackageReqBody) => {
    let filter = filterObject(data)
    const rs: ApiResponse = await client.post(`/packages`, filter)
    return rs
  }
  public static updatePackage = async (id: string, data: UpdatePackageReqBody) => {
    let filter = filterObject(data)
    const rs: ApiResponse = await client.patch(`/packages/${id}`, filter)
    return rs
  }
  public static activePackage = async (id: string) => {
    const rs: ApiResponse = await client.post(`/packages/${id}/active`)
    return rs
  }
  public static deletedPackage = async (id: string) => {
    const rs: ApiResponse = await client.post(`/packages/${id}`)
    return rs
  }
}

export default Package
