import { ObjectId } from 'mongodb'

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
  province?: string
  district?: string
  background?: string
  users?: MemberType[]
  logo?: string
  company_info?: string
  company_size?: string
}
