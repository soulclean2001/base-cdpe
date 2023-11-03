import { ApiResponse } from '~/types'

import client from './client'

import { filterObject } from '~/utils/filterRequestDynamic'
interface WorkingLocation {
  lat: number
  lon: number
  branch_name: string
  address: string
  district: string
  city_name: string
}
export interface UpdateCompanyType {
  company_name?: string
  company_info?: string
  company_size?: string
  logo?: string
  background?: string
  working_locations?: WorkingLocation[]
  fields?: string[] | string
}

export class Company {
  public static getMyCompany = async () => {
    const rs: ApiResponse = await client.get(`/company/me`)
    return rs
  }
  public static updateCompanyById = async (id: string, urlLogo: string, urlBanner: string, data: UpdateCompanyType) => {
    console.log(data)
    let request = {}

    request = filterObject(data)

    if (urlLogo !== 'default') request = { ...request, logo: urlLogo }
    if (urlBanner !== 'default') request = { ...request, background: urlBanner }
    const rs: ApiResponse = await client.patch(`/company/${id}`, request)
    return rs
  }
  public static searchCompany = async (data: { content?: string; field?: string; limit: string; page: string }) => {
    let request = filterObject(data)
    const rs: ApiResponse = await client.get(`/search/company`, { params: request })
    return rs
  }
  public static getDetailCompany = async (id: string) => {
    const rs: ApiResponse = await client.get(`/company/${id}`)
    return rs
  }
  public static getAllJobByCompanyId = async (id: string) => {
    const rs: ApiResponse = await client.get(`jobs/company/${id}`)
    return rs
  }
  public static getAllJobPublishByCompanyId = async (id: string) => {
    const rs: ApiResponse = await client.get(`jobs/published/company/${id}`)
    return rs
  }
}

export default Company
