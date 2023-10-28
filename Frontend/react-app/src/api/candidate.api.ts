import { ApiResponse } from '~/types'
import client from './client'
export interface SearchCandidateReqBody extends Pagination {
  name?: string
  job?: string
  level?: string
  industry?: string[]
  work_location?: string[]
  exp_year_from?: number
  exp_year_to?: number
  foreign_language?: string
  foreign_language_level?: string
  education_level?: string
}

export interface Pagination {
  limit: string
  page: string
}
export interface RequestTurnOnFindingJobs {
  industry: string[]
  work_location: string[]
  experience: number
  cv_public: boolean
  cv_id: string
  education_level: string
}

export class Candidate {
  public static searchCandidate = async (data: SearchCandidateReqBody) => {
    console.log('data', data)
    const rs: ApiResponse = await client.get(`/search/candidate`, { params: data })
    return rs
  }
  public static createTurnOnFindingJobs = async (data: RequestTurnOnFindingJobs) => {
    console.log('data', data)
    const rs: ApiResponse = await client.post(`/candidates`, data)
    return rs
  }
  public static updateTurnOnFindingJobs = async (data: RequestTurnOnFindingJobs) => {
    console.log('data', data)
    const rs: ApiResponse = await client.patch(`/candidates`, data)
    return rs
  }
  public static getMyCandidate = async () => {
    const rs: ApiResponse = await client.get(`/candidates`)
    return rs
  }
  public static publishFinddingJobs = async () => {
    const rs: ApiResponse = await client.post(`/candidates/publish`)
    return rs
  }
  public static hideFinddingJobs = async () => {
    const rs: ApiResponse = await client.post(`/candidates/hide`)
    return rs
  }
}

export default Candidate
