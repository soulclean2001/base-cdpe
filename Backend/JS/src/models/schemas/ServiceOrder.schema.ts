import { ObjectId } from 'mongodb'

export enum ServicePackageStatus {
  Active,
  UnActive,
  Canceled
}

export interface ServiceOrderType {
  _id?: ObjectId
  code: string
  company_id: ObjectId
  order_id: ObjectId
  package_id: ObjectId
  expired_at: Date
  created_at?: Date
  updated_at?: Date
  status: ServicePackageStatus
  quantity: number
  unit_price: number
}

class ServiceOrder {
  _id?: ObjectId
  code: string
  company_id: ObjectId
  order_id: ObjectId
  package_id: ObjectId
  expired_at: Date
  created_at: Date
  updated_at: Date
  status: ServicePackageStatus
  quantity: number
  unit_price: number

  constructor(data: ServiceOrderType) {
    const now = new Date()
    this._id = data._id
    this.code = data.code || ''
    this.company_id = data.company_id
    this.order_id = data.order_id
    this.package_id = data.package_id
    this.expired_at = data.expired_at
    this.created_at = data.created_at || now
    this.updated_at = data.updated_at || now
    this.status = data.status || ServicePackageStatus.UnActive
    this.quantity = data.quantity
    this.unit_price = data.unit_price
  }
}

export default ServiceOrder
