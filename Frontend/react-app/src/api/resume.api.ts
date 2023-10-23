import { ApiResponse } from '~/types'
import client from './client'

export class Resume {
  public static getAllByMe = async () => {
    const rs: ApiResponse = await client.get(`/resumes/me`)
    return rs
  }
}

export default Resume
