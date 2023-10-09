import { ApiResponse } from '~/types'
import client from './client'
export class Post {
  public static getPostById = async (id: string) => {
    const rs: ApiResponse = await client.get(`/jobs/${id}`)
    return rs
  }
}

export default Post
