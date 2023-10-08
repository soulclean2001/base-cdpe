import { ApiResponse } from '~/types'

// import client from './client'
interface WorkingLocation {
  lat: number
  lon: number
  branch_name: string
  address: string
  district: string
  city_name: string
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
}

export default Company
