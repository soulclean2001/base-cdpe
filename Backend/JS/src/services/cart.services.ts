import { ItemType } from '~/models/schemas/Cart.schema'
import databaseServices from './database.services'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'

class CartService {
  static async getCart(user_id: string) {
    const cart = await databaseServices.cart.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id)
      },
      {
        $set: {}
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )

    return cart.value
  }

  static async addOrUpdateItem(user_id: string, item: ItemType) {
    const cart = await CartService.getCart(user_id)

    const pkg = await databaseServices.package.findOne({
      _id: new ObjectId(item.item_id)
    })

    if (!pkg) {
      throw new ErrorWithStatus({
        message: 'Item not found',
        status: 404
      })
    }

    const cartItem = await databaseServices.cartItem.findOneAndUpdate(
      {
        cart_id: cart?._id,
        'item.item_id': new ObjectId(item.item_id)
      },
      {
        $set: {
          'item.quantity': item.quantity
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )

    return cartItem.value
  }

  static async deleteItem(user_id: string, item_id: string) {
    const cart = await CartService.getCart(user_id)

    const cartItem = await databaseServices.cartItem.findOneAndDelete({
      cart_id: cart?._id,
      'item.item_id': new ObjectId(item_id)
    })

    return {
      message: 'delete cart item successfully'
    }
  }

  static async getItem(user_id: string, item_id: string) {
    const cart = await CartService.getCart(user_id)
    const cartItem = await databaseServices.cartItem.findOne({
      cart_id: cart?._id,
      'item.item_id': new ObjectId(item_id)
    })

    if (!cartItem) {
      throw new ErrorWithStatus({
        message: 'Item not found',
        status: 404
      })
    }

    return cartItem
  }

  static async getAllItem(user_id: string) {
    const cart = await CartService.getCart(user_id)
    if (!cart)
      throw new ErrorWithStatus({
        message: 'Cart not found',
        status: 404
      })
    const cartItem = await databaseServices.cartItem
      .aggregate([
        {
          $match: {
            cart_id: cart._id
          }
        },
        {
          $lookup: {
            from: 'packages',
            localField: 'item.item_id',
            foreignField: '_id',
            as: 'package'
          }
        },
        {
          $unwind: {
            path: '$package',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            'package.status': 0
          }
        }
      ])
      .toArray()

    return cartItem
  }
}

export default CartService
