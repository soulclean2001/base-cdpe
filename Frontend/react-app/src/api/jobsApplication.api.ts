import { ApiResponse } from '~/types'
import client from './client'
import { filterObject } from '~/utils/filterRequestDynamic'
export interface SearchJobApplicationType {
  content?: string
  post_id?: string
  from_date?: string
  to_date?: string
  status?: string
  profile_status?: string
  limit?: string
  page?: string
}
export class JobsApplication {
  public static getJobsApplicationByFilter = async (searchParam: any) => {
    let param = filterObject(searchParam)
    const rs: ApiResponse = await client.get(`/job-applications`, { params: param })
    return rs
  }
  public static getJobsApplicationById = async (id: string) => {
    const rs: ApiResponse = await client.get(`/job-applications/${id}`)
    return rs
  }
}

export default JobsApplication
