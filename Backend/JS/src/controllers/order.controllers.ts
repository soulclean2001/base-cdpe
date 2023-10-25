import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
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
}

export default new OrderController()
