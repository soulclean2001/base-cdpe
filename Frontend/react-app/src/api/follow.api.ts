import { ApiResponse } from '~/types'
import client from './client'

export interface RequestTrackedCandidateType {
  name?: string
  limit?: string
  page?: string
}
export class Follow {
  public static follow = async (company_id: string) => {
    const rs: ApiResponse = await client.post(`/followers/company`, { company_id })
    return rs
  }
  public static unFollow = async (data: { company_id: string }) => {
    const rs: ApiResponse = await client.delete(`/followers/company`, { data: data })
    return rs
  }
  public static getCompanyCandidateHasFollowed = async () => {
    const rs: ApiResponse = await client.get(`/followers/company`)
    return rs
  }
}

export default Follow
