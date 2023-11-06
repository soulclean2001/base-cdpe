import { ApiResponse } from '~/types'
import client from './client'

import { filterObject } from '~/utils/filterRequestDynamic'
export interface RequestTrackedCandidateType {
  name?: string
  limit?: string
  page?: string
}
export class TrackedCandidate {
  public static getAllByMe = async (request: RequestTrackedCandidateType) => {
    let filterRequest = filterObject(request)
    const rs: ApiResponse = await client.get(`/follow-candidates`, { params: filterRequest })
    return rs
  }
  public static follow = async (candidate_id: string) => {
    const rs: ApiResponse = await client.post(`/follow-candidates/follow`, { candidate_id })
    return rs
  }
  public static unFollow = async (candidate_id: string) => {
    const rs: ApiResponse = await client.post(`/follow-candidates/unfollow`, { candidate_id })
    return rs
  }
}

export default TrackedCandidate
