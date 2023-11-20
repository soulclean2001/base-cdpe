import { ObjectId } from 'mongodb'

interface TransactionHistoryType {
  _id?: ObjectId
  order_id: ObjectId
  bill_number: string
  bank_tran_no?: string
  card_type?: string
  transaction_no?: string
  amount: number
  ip_addr: string
  transaction_status: string
  order_info: string
  bank_code: string
  created_at?: Date
  updated_at?: Date
  payment_status: string
}

class TransactionHistory {
  _id?: ObjectId
  transaction_status: string
  bill_number: string
  bank_tran_no: string
  card_type: string
  transaction_no: string
  amount: number
  ip_addr: string
  bank_code: string
  created_at: Date
  order_info: string
  payment_status: string
  order_id: ObjectId
  updated_at: Date

  constructor(data: TransactionHistoryType) {
    const now = new Date()
    this._id = data._id
    this.transaction_status = data.transaction_status || '01'
    this.bill_number = data.bill_number
    this.amount = data.amount
    this.ip_addr = data.ip_addr
    this.bank_code = data.bank_code || ''
    this.created_at = data.created_at || now
    this.updated_at = data.updated_at || now
    this.order_info = data.order_info
    this.payment_status = data.payment_status
    this.transaction_no = data.transaction_no || ''
    this.bank_tran_no = data.bank_tran_no || ''
    this.card_type = data.card_type || ''
    this.order_id = data.order_id
  }
}

export default TransactionHistory
