import { ObjectId } from 'mongodb'
import { WorkingLocation } from '../schemas/Job.schema'

export interface MemberType {
  user_id: ObjectId
  position: PositionType
}

export enum PositionType {
  Admin,
  Hr,
  Accountant
}

export interface UpdateCompanyReqBody {
  company_name?: string
  background?: string
  users?: MemberType[]
  logo?: string
  company_info?: string
  company_size?: string
  logo_image_file?: File
  background_image_file?: File
  working_locations?: WorkingLocation[]
  fields?: string[]
}
