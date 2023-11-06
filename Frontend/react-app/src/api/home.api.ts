import { ApiResponse } from '~/types'
import client from './client'

export class HomeApi {
  public static getCompaniesBanner = async () => {
    const rs: ApiResponse = await client.get(`/orders/list-banner`)
    return rs
  }
  public static getTopJobs = async () => {
    const rs: ApiResponse = await client.get(`/orders/best-jobs`)
    return rs
  }
  public static getTotalJobsByCareer = async (career: string) => {
    const rs: ApiResponse = await client.get(`/jobs/total-job`, { params: career })
    return rs
  }
}

export default HomeApi
