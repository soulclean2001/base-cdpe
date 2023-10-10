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
export class Candidate {
  public static searchCandidate = async (data: SearchCandidateReqBody) => {
    console.log('data', data)
    const rs: ApiResponse = await client.get(`/search/candidate`, { params: data })
    return rs
  }
}

export default Candidate
