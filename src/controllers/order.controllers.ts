import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { redis } from '~/app/redis'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/User.request'
import OrderService from '~/services/order.services'

class OrderController {
  async order(
    req: Request<
      ParamsDictionary,
      any,
      {
        items: {
          item_id: string
          quantity: number
        }[]
      }
    >,
    res: Response,
    next: NextFunction
  ) {
    const { user_id } = req.decoded_authorization as TokenPayload

    const result = await OrderService.order({
      user_id,
      items: req.body.items
    })

    return res.json({
      message: 'Order',
      result
    })
  }

  async getAllOrdersByCompany(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await OrderService.getAllOrdersByCompany(user_id, req.query)

    return res.json({
      message: 'get all orders by company',
      result
    })
  }

  async getAllOrdersByAdmin(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await OrderService.getAllOrdersByAdmin(req.query)

    return res.json({
      message: 'get all orders by admin',
      result
    })
  }

  async getOrdersDetailByAdmin(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { order_id } = req.params

    if (!ObjectId.isValid(order_id))
      throw new ErrorWithStatus({
        message: 'Invalid order identifier',
        status: 422
      })

    const result = await OrderService.getOrdersDetailByAdmin(order_id)

    return res.json({
      message: 'get all orders by admin',
      result
    })
  }

  async getOrdersDetailByCompany(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { order_id } = req.params

    if (!ObjectId.isValid(order_id))
      throw new ErrorWithStatus({
        message: 'Invalid order identifier',
        status: 422
      })

    const result = await OrderService.getOrdersDetailByCompany(user_id, order_id)

    return res.json({
      message: 'get all orders by company',
      result
    })
  }

  // async activeServiceOrder(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
  //   const { user_id } = req.decoded_authorization as TokenPayload
  //   const { service_id } = req.body

  //   if (!ObjectId.isValid(service_id))
  //     throw new ErrorWithStatus({
  //       message: 'Invalid service identifier',
  //       status: 422
  //     })

  //   const result = await OrderService.activeServiceOrder(service_id)

  //   return res.json({
  //     message: 'active service',
  //     result
  //   })
  // }

  async activeServiceOrderByOrderId(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { order_id } = req.body

    if (!ObjectId.isValid(order_id))
      throw new ErrorWithStatus({
        message: 'Invalid service identifier',
        status: 422
      })

    const result = await OrderService.activeServiceOrderByOrderId(order_id)

    return res.json({
      message: 'active services from order',
      result
    })
  }

  async cancelOrderById(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { order_id } = req.body

    if (!ObjectId.isValid(order_id))
      throw new ErrorWithStatus({
        message: 'Invalid service identifier',
        status: 422
      })

    const result = await OrderService.cancelOrderById(order_id)

    return res.json({
      message: 'canceled order',
      result
    })
  }

  async getAllCompanyBuyBannerStillValid(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const result = await OrderService.getAllCompanyBuyBannerStillValid()

    return res.json({
      message: 'get successfully',
      result
    })
  }

  async getAllJobHasCompanyBuyBannerStillValid(
    req: Request<ParamsDictionary, any, any>,
    res: Response,
    next: NextFunction
  ) {
    const result = await OrderService.getAllJobHasCompanyBuyBannerStillValid()

    return res.json({
      message: 'get successfully',
      result
    })
  }

  async getInfoOrder(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const orderId = req.params.order_id
    if (!ObjectId.isValid(orderId))
      throw new ErrorWithStatus({
        message: 'Invalid order identifier',
        status: 422
      })

    const orderExist = await redis.get(orderId)
    const timeEx = await redis.ex(orderId)

    return res.json({
      message: 'get infor order',
      result: {
        order_id: orderExist ? orderId : null,
        time_ex: timeEx
      }
    })
  }
}

export default new OrderController()
