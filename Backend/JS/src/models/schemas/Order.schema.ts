import { ObjectId } from 'mongodb'

export enum StatusOrder {
  Processing,
  Cancled,
  Success,
  Paid,
  Error,
  WaitForPay
}

export interface OrderType {
  _id?: ObjectId
  company_id: ObjectId
  total: number
  services: ObjectId[]
  updated_at?: Date
  created_at?: Date
  status?: StatusOrder
  discount?: number
}

export interface ServiceOrderDetail {
  package_id: ObjectId
  quantity: number
  unit_price: number
}

class Order {
  _id?: ObjectId
  company_id: ObjectId
  total: number
  services: ObjectId[]
  updated_at: Date
  created_at: Date
  status: StatusOrder
  discount: number

  constructor(data: OrderType) {
    const now = new Date()
    this._id = data._id
    this.company_id = data.company_id
    this.total = data.total
    this.discount = data.discount || 0
    this.services = data.services
    this.created_at = data.created_at || now
    this.updated_at = data.updated_at || now
  }
}

export default Order
