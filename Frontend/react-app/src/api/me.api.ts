import { ApiResponse } from '~/types'
import client from './client'
import { filterObject } from '~/utils/filterRequestDynamic'
export interface MeRequestType {
  name?: string
  date_of_birth?: string
  avatar?: string
  phone_number?: string
  gender?: number | string
}
export interface MeResponseType {
  _id: string
  name: string
  date_of_birth: string
  avatar: string
  phone_number: string
  gender: number
}
export class Me {
  public static getMe = async () => {
    const rs: ApiResponse = await client.get(`/users/me`)
    return rs
  }
  public static updateMe = async (request: MeRequestType, urlAvatar: string) => {
    let requestFilter = filterObject(request)
    console.log('requestFilter', requestFilter)
    if (urlAvatar !== 'default') {
      requestFilter = { ...requestFilter, avatar: urlAvatar }
    }
    const rs: ApiResponse = await client.patch(`/users/me`, requestFilter)
    return rs
  }
}

export default Me
