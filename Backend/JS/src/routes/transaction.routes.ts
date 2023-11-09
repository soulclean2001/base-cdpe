/* eslint-disable no-undef */
import express from 'express'
import { envConfig } from '../constants/config'
import querystring from 'qs'
import moment from 'moment'
import crypto from 'crypto'
import { Buffer } from 'buffer'
import TransactionHistory from '~/models/schemas/TransactionHistory.schema'
import databaseServices from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'
import { StatusOrder } from '~/models/schemas/Order.schema'
import { ServicePackageStatus } from '~/models/schemas/ServiceOrder.schema'
import { accessTokenValidator, isEmployer } from '~/middlewares/users.middlewares'
import transactionControllers from '~/controllers/transaction.controllers'
import NotificationService from '~/services/notification.services'
import { NotificationObject } from '~/models/schemas/Notification.schema'
import { UserRole } from '~/constants/enums'
import wrapAsync from '~/utils/handlers'

const transactionRouter = express.Router()

transactionRouter.post(
  '/create_payment_url',
  wrapAsync(async function (req, res, next) {
    const ordId = req.body.order_id

    if (!ordId || !ObjectId.isValid(ordId)) {
      throw new ErrorWithStatus({
        message: 'Invalid order ',
        status: 405
      })
    }
    const order = await databaseServices.order.findOne({
      _id: new ObjectId(ordId)
    })

    if (!order)
      throw new ErrorWithStatus({
        message: 'Invalid order ',
        status: 405
      })

    if (order.status === StatusOrder.Success)
      return res.json({
        message: 'Order was paided',
        status: 204
      })

    if (order.status === StatusOrder.Canceled)
      return res.json({
        message: 'Order was canceled',
        status: 204
      })

    process.env.TZ = 'Asia/Ho_Chi_Minh'

    const date = new Date()
    const createDate = moment(date).format('YYYYMMDDHHmmss')

    const ipAddr = req.ip
    // req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress
    // ||    req.connection.socket.remoteAddress

    const tmnCode = envConfig.vnpTmnCode
    const secretKey = envConfig.vnpHashSecret
    let vnpUrl = envConfig.vnpUrl
    const returnUrl = envConfig.vnpReturnUrl
    const trade_code = moment(date).format('YYMMDDHHmmss')
    // const amount = req.body.amount
    // const bankCode = req.body.bankCode
    const bankCode = 'VNBANK'

    let locale = req.body.language
    if (!locale) {
      locale = 'vn'
    }
    const currCode = 'VND'
    let vnp_Params: {
      [key: string]: any
    } = {}
    vnp_Params['vnp_Version'] = '2.1.0'
    vnp_Params['vnp_Command'] = 'pay'
    vnp_Params['vnp_TmnCode'] = tmnCode
    vnp_Params['vnp_Locale'] = locale
    vnp_Params['vnp_CurrCode'] = currCode
    vnp_Params['vnp_TxnRef'] = trade_code
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + trade_code
    vnp_Params['vnp_OrderType'] = 'other'
    vnp_Params['vnp_Amount'] = order.total * 100
    vnp_Params['vnp_ReturnUrl'] = returnUrl
    vnp_Params['vnp_IpAddr'] = ipAddr
    vnp_Params['vnp_CreateDate'] = createDate
    if (bankCode) {
      vnp_Params['vnp_BankCode'] = bankCode
    }

    await databaseServices.transaction.insertOne(
      new TransactionHistory({
        amount: order.total * 100,
        bank_code: '',
        bill_number: trade_code,
        ip_addr: ipAddr,
        transaction_status: '01',
        order_info: 'Thanh toan cho ma GD:' + trade_code,
        payment_status: '0',
        order_id: new ObjectId(ordId)
      })
    )

    vnp_Params = sortObject(vnp_Params)

    const signData = querystring.stringify(vnp_Params, { encode: false })
    const hmac = crypto.createHmac('sha512', secretKey)
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')
    vnp_Params['vnp_SecureHash'] = signed
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false })

    return res.json({
      result: vnpUrl
    })
  })
)

transactionRouter.get(
  '/vnpay_return',
  wrapAsync(async function (req, res, next) {
    let vnp_Params = req.query

    const secureHash = vnp_Params['vnp_SecureHash']

    delete vnp_Params['vnp_SecureHash']
    delete vnp_Params['vnp_SecureHashType']
    const vnp_TxnRef = vnp_Params['vnp_TxnRef']
    const vnp_TransactionNo = vnp_Params['vnp_TransactionNo']
    const vnp_TransactionStatus = vnp_Params['vnp_TransactionStatus']
    const vnp_BankTranNo = vnp_Params['vnp_BankTranNo']
    const vnp_BankCode = vnp_Params['vnp_BankCode']
    const vnp_CardType = vnp_Params['vnp_CardType']

    vnp_Params = sortObject(vnp_Params)

    const tmnCode = envConfig.vnpTmnCode
    const secretKey = envConfig.vnpHashSecret

    const signData = querystring.stringify(vnp_Params, { encode: false })
    const hmac = crypto.createHmac('sha512', secretKey)
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

    let transaction = undefined
    if (secureHash === signed) {
      //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
      transaction = await databaseServices.transaction.findOneAndUpdate(
        {
          bill_number: vnp_TxnRef
        },
        {
          $set: {
            transaction_no: vnp_TransactionNo as string,
            bank_tran_no: vnp_BankTranNo as string,
            transaction_status: vnp_TransactionStatus as string,
            bank_code: vnp_BankCode as string,
            card_type: vnp_CardType as string
          }
        }
      )
    } else {
      transaction = await databaseServices.transaction.findOneAndUpdate(
        {
          bill_number: vnp_TxnRef
        },
        {
          $set: {
            transaction_no: vnp_TransactionNo as string,
            bank_tran_no: vnp_BankTranNo as string,
            transaction_status: '97',
            bank_code: vnp_BankCode as string,
            card_type: vnp_CardType as string
          }
        },
        {
          returnDocument: 'after'
        }
      )
    }

    if (transaction && transaction.value) {
      await databaseServices.order.findOneAndUpdate(
        {
          _id: transaction.value.order_id
        },
        {
          $set: {
            status: vnp_TransactionStatus === '00' ? StatusOrder.Success : StatusOrder.Canceled
          }
        }
      )

      await databaseServices.serviceOrder.updateMany(
        {
          order_id: transaction.value.order_id
        },
        {
          $set: {
            status: vnp_TransactionStatus === '00' ? ServicePackageStatus.UnActive : ServicePackageStatus.Canceled
          }
        }
      )

      if (vnp_TransactionStatus === '00') {
        const admin = await databaseServices.users.findOne({
          role: UserRole.Administrators
        })
        if (admin)
          await NotificationService.notify({
            content: 'Đã có 1 đơn hàng mới giao dịch thành công',
            object_recieve: NotificationObject.Admin,
            recievers: [admin._id.toString() as string],
            type: 'order/success'
          })
      }
    }
    return res.json({
      result: {
        code: vnp_Params['vnp_ResponseCode']
      }
    })
  })
)

transactionRouter.get('/vnpay_ipn', function (req, res, next) {
  let vnp_Params = req.query
  const secureHash = vnp_Params['vnp_SecureHash']

  const orderId = vnp_Params['vnp_TxnRef']
  const rspCode = vnp_Params['vnp_ResponseCode']

  delete vnp_Params['vnp_SecureHash']
  delete vnp_Params['vnp_SecureHashType']

  vnp_Params = sortObject(vnp_Params)
  const secretKey = envConfig.vnpHashSecret
  const signData = querystring.stringify(vnp_Params, { encode: false })
  const hmac = crypto.createHmac('sha512', secretKey)
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')

  const paymentStatus = '0' // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
  //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
  //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

  const checkOrderId = true // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
  const checkAmount = true // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
  if (secureHash === signed) {
    //kiểm tra checksum
    if (checkOrderId) {
      if (checkAmount) {
        if (paymentStatus == '0') {
          //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
          if (rspCode == '00') {
            //thanh cong
            //paymentStatus = '1'
            // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
            res.status(200).json({ RspCode: '00', Message: 'Success' })
          } else {
            //that bai
            //paymentStatus = '2'
            // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
            res.status(200).json({ RspCode: '00', Message: 'Success' })
          }
        } else {
          res.status(200).json({
            RspCode: '02',
            Message: 'This order has been updated to the payment status'
          })
        }
      } else {
        res.status(200).json({ RspCode: '04', Message: 'Amount invalid' })
      }
    } else {
      res.status(200).json({ RspCode: '01', Message: 'Order not found' })
    }
  } else {
    res.status(200).json({ RspCode: '97', Message: 'Checksum failed' })
  }
})

transactionRouter.post('/querydr', async function (req, res, next) {
  process.env.TZ = 'Asia/Ho_Chi_Minh'
  const date = new Date()

  const vnp_TmnCode = envConfig.vnpTmnCode
  const secretKey = envConfig.vnpHashSecret
  const vnp_Api = envConfig.vnpApi

  const vnp_TxnRef = req.body.orderId
  const vnp_TransactionDate = req.body.transDate

  const vnp_RequestId = moment(date).format('HHmmss')
  const vnp_Version = '2.1.0'
  const vnp_Command = 'querydr'
  const vnp_OrderInfo = 'Truy van GD ma:' + vnp_TxnRef

  const vnp_IpAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress
  // ||    req.connection.socket.remoteAddress

  const currCode = 'VND'
  const vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss')

  const data =
    vnp_RequestId +
    '|' +
    vnp_Version +
    '|' +
    vnp_Command +
    '|' +
    vnp_TmnCode +
    '|' +
    vnp_TxnRef +
    '|' +
    vnp_TransactionDate +
    '|' +
    vnp_CreateDate +
    '|' +
    vnp_IpAddr +
    '|' +
    vnp_OrderInfo

  const hmac = crypto.createHmac('sha512', secretKey)
  const vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest('hex')

  const dataObj = {
    vnp_RequestId: vnp_RequestId,
    vnp_Version: vnp_Version,
    vnp_Command: vnp_Command,
    vnp_TmnCode: vnp_TmnCode,
    vnp_TxnRef: vnp_TxnRef,
    vnp_OrderInfo: vnp_OrderInfo,
    vnp_TransactionDate: vnp_TransactionDate,
    vnp_CreateDate: vnp_CreateDate,
    vnp_IpAddr: vnp_IpAddr,
    vnp_SecureHash: vnp_SecureHash
  }
  // /merchant_webapi/api/transaction

  // request(
  //   {
  //     url: vnp_Api,
  //     method: 'POST',
  //     json: true,
  //     body: dataObj
  //   },
  //   function (error, response, body) {
  //     console.log(response.body, body)
  //   }
  // )
})

transactionRouter.post('/refund', function (req, res, next) {
  process.env.TZ = 'Asia/Ho_Chi_Minh'
  const date = new Date()

  const vnp_TmnCode = envConfig.vnpTmnCode
  const secretKey = envConfig.vnpHashSecret
  const vnp_Api = envConfig.vnpApi

  const vnp_TxnRef = req.body.orderId
  const vnp_TransactionDate = req.body.transDate
  const vnp_Amount = req.body.amount * 100
  const vnp_TransactionType = req.body.transType
  const vnp_CreateBy = req.body.user

  const currCode = 'VND'

  const vnp_RequestId = moment(date).format('HHmmss')
  const vnp_Version = '2.1.0'
  const vnp_Command = 'refund'
  const vnp_OrderInfo = 'Hoan tien GD ma:' + vnp_TxnRef

  const vnp_IpAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress
  // ||    req.connection.socket.remoteAddress

  const vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss')

  const vnp_TransactionNo = '0'

  const data =
    vnp_RequestId +
    '|' +
    vnp_Version +
    '|' +
    vnp_Command +
    '|' +
    vnp_TmnCode +
    '|' +
    vnp_TransactionType +
    '|' +
    vnp_TxnRef +
    '|' +
    vnp_Amount +
    '|' +
    vnp_TransactionNo +
    '|' +
    vnp_TransactionDate +
    '|' +
    vnp_CreateBy +
    '|' +
    vnp_CreateDate +
    '|' +
    vnp_IpAddr +
    '|' +
    vnp_OrderInfo
  const hmac = crypto.createHmac('sha512', secretKey)
  const vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest('hex')

  const dataObj = {
    vnp_RequestId: vnp_RequestId,
    vnp_Version: vnp_Version,
    vnp_Command: vnp_Command,
    vnp_TmnCode: vnp_TmnCode,
    vnp_TransactionType: vnp_TransactionType,
    vnp_TxnRef: vnp_TxnRef,
    vnp_Amount: vnp_Amount,
    vnp_TransactionNo: vnp_TransactionNo,
    vnp_CreateBy: vnp_CreateBy,
    vnp_OrderInfo: vnp_OrderInfo,
    vnp_TransactionDate: vnp_TransactionDate,
    vnp_CreateDate: vnp_CreateDate,
    vnp_IpAddr: vnp_IpAddr,
    vnp_SecureHash: vnp_SecureHash
  }

  // request(
  //   {
  //     url: vnp_Api,
  //     method: 'POST',
  //     json: true,
  //     body: dataObj
  //   },
  //   function (error, response, body) {
  //     console.log(response)
  //   }
  // )
})

transactionRouter.get('/', accessTokenValidator, isEmployer, wrapAsync(transactionControllers.getTransactionsByCompany))

function sortObject(obj: any) {
  const sorted: {
    [key: string]: any
  } = {}
  const str = []
  let key
  for (key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key))
    }
  }
  str.sort()
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+')
  }
  return sorted
}

export default transactionRouter
