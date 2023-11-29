import { ApiResponse } from '~/types'
import client from './client'
import { JobType } from '~/features/Employer/pages/Dashboard/components/ModalInfoPost/ModalInfoPost'
import { filterObject } from '~/utils/filterRequestDynamic'
export interface PostRequestSearchType {
  content?: string
  working_location?: string
  job_level?: string
  job_type?: string

  industry?: string
  career?: string
  sort_by_salary?: string
  sort_by_post_date?: string
  limit?: string
  page?: string
  'salary[min]'?: string
  'salary[max]'?: string
  is_expried?: boolean | string
}
export interface PostFilterRequestType {
  limit?: string
  page?: string
  expired_before_nday?: number
  is_expired?: boolean
  visibility?: boolean //hiden publish
  content?: string //input search
  from_day?: string
  to_day?: string
  status?: string
}
export class Post {
  public static getPostsFormEmployer = async (param: PostFilterRequestType) => {
    let filterParam = filterObject(param)
    const rs: ApiResponse = await client.get(`/jobs/company/filter`, { params: filterParam })
    return rs
  }
  public static getPostById = async (id: string, idUser?: string) => {
    const rs: ApiResponse = await client.get(`/jobs/${id}`, { params: { user_id: idUser } })
    return rs
  }
  public static addPost = async (data: JobType) => {
    const rs: ApiResponse = await client.post(`/jobs`, data)
    return rs
  }
  public static updatePost = async (id: string, data: JobType) => {
    const rs: ApiResponse = await client.patch(`/jobs/${id}`, data)
    return rs
  }
  public static publishPost = async (id: string, expired_date: string) => {
    const rs: ApiResponse = await client.post(`/jobs/${id}/publish`, { expired_date })
    return rs
  }
  public static hidePost = async (id: string) => {
    const rs: ApiResponse = await client.post(`/jobs/${id}/hide`)
    return rs
  }
  public static deletePost = async (id: string) => {
    const rs: ApiResponse = await client.delete(`/jobs/${id}`)
    return rs
  }
  public static searchJobs = async (data: PostRequestSearchType) => {
    const filterRequest = filterObject(data)

    const rs: ApiResponse = await client.get(`/search/job2`, {
      params: filterRequest
    })
    return rs
  }
}

export default Post
