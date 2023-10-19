import { ApiResponse } from '~/types'
import client from './client'
import { JobType } from '~/features/Employer/pages/Dashboard/components/ModalInfoPost/ModalInfoPost'
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
}

export default Post
