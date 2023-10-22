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
  sort_by_salary?: number
  sort_by_post_date?: number
  limit?: string
  page?: string
  'salary[min]'?: string
  'salary[max]'?: string
}

export class Post {
  public static getPostById = async (id: string) => {
    const rs: ApiResponse = await client.get(`/jobs/${id}`)
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
  public static searchJobs = async (data: PostRequestSearchType) => {
    const filterRequest = filterObject(data)

    const rs: ApiResponse = await client.get(`/search/job2`, {
      params: filterRequest
    })
    return rs
  }
}

export default Post
