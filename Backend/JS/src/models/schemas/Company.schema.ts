import { ObjectId } from 'mongodb'
import { MemberType } from '../requests/Company.request'

export interface CompanyType {
  _id?: ObjectId
  company_name: string
  province: string
  district: string
  address?: string
  company_info?: string
  logo?: string
  users: MemberType[]
  background?: string
  company_size?: string
}

export default class Company {
  _id?: ObjectId
  company_name: string
  province: string
  district: string
  company_info: string
  address: string
  logo: string
  users: MemberType[]
  background: string
  company_size: string // quy mô
  constructor(company: CompanyType) {
    this._id = company._id
    this.company_name = company.company_name
    this.province = company.province
    this.district = company.district
    this.users = company.users
    this.logo = company.logo || ''
    this.background = company.background || ''
    this.company_info = company.company_info || ''
    this.address = company.address || ''
    this.company_size = company.company_size || ''
  }
}
