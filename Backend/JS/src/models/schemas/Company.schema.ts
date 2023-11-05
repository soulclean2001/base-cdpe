import { ObjectId } from 'mongodb'
import { MemberType } from '../requests/Company.request'
import { WorkingLocation } from './Job.schema'

export interface CompanyType {
  _id?: ObjectId
  company_name: string
  company_info?: string
  logo?: string
  users: MemberType[]
  background?: string
  company_size?: string
  working_locations: WorkingLocation[]
  fields: string[]
  number_of_posts?: number
}

export default class Company {
  _id?: ObjectId
  company_name: string
  company_info: string
  logo: string
  users: MemberType[]
  background: string
  company_size: string // quy mô
  working_locations: WorkingLocation[]
  fields: string[]
  number_of_posts: number

  constructor(company: CompanyType) {
    this._id = company._id
    this.company_name = company.company_name
    this.users = company.users
    this.logo = company.logo || ''
    this.background = company.background || ''
    this.company_info = company.company_info || ''
    this.company_size = company.company_size || ''
    this.working_locations = company.working_locations || []
    this.fields = company.fields || []
    this.number_of_posts = company.number_of_posts || 3
  }
}
