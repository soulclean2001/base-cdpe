import client from './client'

interface CreatePaymentType {
  bankcode: string
  amount: number
  order_id: string
}
export class Payment {
  public static createPayment = async (data: CreatePaymentType) => {
    const rs: any = await client.post(`/transactions/create_payment_url`, data)
    return rs
  }
  public static getVNPayReturn = async (param: any) => {
    const rs: any = await client.get(`/transactions/vnpay_return`, { params: param })
    return rs
  }
}

export default Payment
