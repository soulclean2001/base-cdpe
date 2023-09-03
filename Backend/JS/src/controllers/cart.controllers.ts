import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CartItemReqBody } from '~/models/requests/Cart.request'
import CartService from '~/services/cart.services'

class CartController {
  async getCart(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization

    const result = await CartService.getCart(user_id)

    return res.json({
      message: 'get cart',
      result
    })
  }

  async addOrUpdateItem(req: Request<ParamsDictionary, any, CartItemReqBody>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization
    const { item } = req.body

    const result = await CartService.addOrUpdateItem(user_id, item)

    return res.json({
      message: 'add/update cart item',
      result
    })
  }
  async deleteItem(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization
    const { item_id } = req.params

    const result = await CartService.deleteItem(user_id, item_id)

    return res.json(result)
  }

  async getItem(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization
    const { item_id } = req.params

    const result = await CartService.getItem(user_id, item_id)

    return res.json({
      message: 'get cart item',
      result
    })
  }

  async getAllItem(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization

    const result = await CartService.getAllItem(user_id)

    return res.json({
      message: 'get all cart item',
      result
    })
  }
}

export default new CartController()
