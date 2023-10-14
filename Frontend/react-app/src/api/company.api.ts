import { ApiResponse } from '~/types'

import client from './client'
import { CompanyType } from '~/features/Employer/pages/Dashboard/pages/CompanyManagePage/CompanyManagePage'
import { filter } from 'lodash'
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
}
let dataWorkLocation = [
  {
    lat: 1,
    lon: 1,
    branch_name: 'Trụ sở chính',
    address: 'F4/1A',
    district: 'Gò Vấp',
    city_name: 'TP. Hồ Chí Minh'
  },
  {
    lat: 1,
    lon: 1,
    branch_name: 'Trụ sở 2',
    address: 'F2/2A',
    district: 'Bình Chánh',
    city_name: 'TP. Hồ Chí Minh'
  }
]
export class Company {
  public static getWorkLocations = async () => {
    const rs: ApiResponse = {
      message: 'data lỏ',
      result: dataWorkLocation
    }
    return rs
  }
  public static addWorkLocation = async (data: WorkingLocation) => {
    dataWorkLocation.push(data)
    const rs: ApiResponse = {
      message: 'add thanh cong',
      result: []
    }
    return rs
  }
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
}

export default Company
