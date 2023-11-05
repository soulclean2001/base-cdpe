import { ObjectId } from 'mongodb'
import { PackageType as PackageTypeEnum } from '~/constants/enums'

export enum PackageStatus {
  DELETED = 'DELETED',
  ACTIVE = 'ACTIVE',
  ARCHIVE = 'ARCHIVE'
}

export interface PackageType {
  _id?: ObjectId
  type: PackageTypeEnum
  price: number
  title: string
  description: string
  includes: string
  code?: string
  discount_price?: number
  preview?: string
  deleted_at?: Date
  created_at?: Date
  updated_at?: Date
  status?: PackageStatus
  number_of_days_to_expire: number
  value?: number
}

export default class Package {
  _id?: ObjectId
  type: PackageTypeEnum
  price: number
  title: string
  description: string
  includes: string
  code: string
  discount_price: number
  preview: string
  deleted_at?: Date
  created_at: Date
  updated_at: Date
  status: PackageStatus
  number_of_days_to_expire: number
  value: number

  constructor(data: PackageType) {
    const date = new Date()
    this._id = data._id
    this.type = data.type
    this.price = data.price
    this.title = data.title
    this.description = data.description
    this.includes = data.includes
    this.code = data.code || ''
    this.discount_price = data.discount_price || data.price
    this.preview = data.preview || ''
    this.created_at = data.created_at || date
    this.updated_at = data.updated_at || date
    this.status = data.status || PackageStatus.ARCHIVE
    this.number_of_days_to_expire = data.number_of_days_to_expire
    this.value = data.value || 1
  }
}
