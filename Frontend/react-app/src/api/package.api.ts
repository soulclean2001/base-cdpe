import { ApiResponse } from '~/types'
import client from './client'

import { filterObject } from '~/utils/filterRequestDynamic'
interface RequestFilterPackageType {
  title?: string
  limit?: string
  page?: string
}
export class Package {
  //using for employ
  public static getAllPackageForEmployClient = async (request: RequestFilterPackageType) => {
    // let filter = filterObject(request)
    const rs: ApiResponse = await client.get(`/packages/get-by-filter`, { params: request })
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
}

export default Package
