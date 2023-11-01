import { ApiResponse } from '~/types'
import client from './client'
import { filterObject } from '~/utils/filterRequestDynamic'
export interface JobSearchByAdmin {
  content?: string
  from_day?: string
  to_day?: string
  status?: string
  limit?: string
  page?: string
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
}

export default Admin
