import { ObjectId } from 'mongodb'

enum StatusPurchase {
  Processing,
  Success,
  Error
}

interface TransactionHistoryType {
  _id: ObjectId
  package_id: ObjectId
  status: StatusPurchase
  created_at?: Date
  updated_at?: Date
}

class TransactionHistory {
  _id: ObjectId
  package_id: ObjectId
  status: StatusPurchase
  created_at: Date
  updated_at: Date

  constructor(data: TransactionHistoryType) {
    const date = new Date()
    this._id = data._id
    this.status = data.status
    this.created_at = data.created_at || date
    this.updated_at = data.updated_at || date
    this.package_id = data.package_id
  }
}

export default TransactionHistory
