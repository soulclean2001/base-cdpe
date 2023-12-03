import { ApiResponse } from '~/types'
import client from './client'
import { ResumeRequestBody } from '~/types/resume.type'
import { filterObject } from '~/utils/filterRequestDynamic'

export class Resume {
  public static getAllByMe = async () => {
    const rs: ApiResponse = await client.get(`/resumes/me`)
    return rs
  }
  public static createOrUpdateResume = async (data: ResumeRequestBody) => {
    let filterBody = filterObject(data)
    const rs: ApiResponse = await client.post(`/resumes/me`, filterBody)
    return rs
  }
}

export default Resume
