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
export interface ApplyReqBody {
  job_post_id: string
  application_date: string
  cv_link?: string
  cv_id?: string
  full_name: string
  phone_number?: string
  email: string
  type: number
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
  public static applyJob = async (data: ApplyReqBody) => {
    const rs: ApiResponse = await client.post(`/job-applications`, data)
    return rs
  }
  public static checkApplied = async (idJob: string) => {
    const rs: ApiResponse = await client.get(`/job-applications/me/applied/${idJob}`)
    return rs
  }
  public static getAllJobApplicationsFromCandidate = async () => {
    const rs: ApiResponse = await client.get(`/job-applications/get-all-from-candidate`)
    return rs
  }
  public static approveCV = async (id: string) => {
    const rs: ApiResponse = await client.post(`/job-applications/approve/${id}`)
    return rs
  }
  public static rejectCV = async (id: string) => {
    const rs: ApiResponse = await client.post(`/job-applications/reject/${id}`)
    return rs
  }
  public static updateStatus = async (id: string, status: number) => {
    const rs: ApiResponse = await client.post(`/job-applications/update-status/${id}`, { status })
    return rs
  }
  public static updateProfileStatus = async (id: string, profile_status: string) => {
    const rs: ApiResponse = await client.post(`/job-applications/update-profile-status/${id}`, { profile_status })
    return rs
  }
}

export default JobsApplication
