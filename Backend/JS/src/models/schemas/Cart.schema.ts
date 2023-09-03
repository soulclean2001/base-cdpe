import { ObjectId } from 'mongodb'

export interface ItemType {
  quantity: number
  item_id: string
}

interface CartItemType {
  _id?: ObjectId
  item: ItemType
  cart_id: ObjectId
}

export interface CartType {
  _id?: ObjectId
  user_id: ObjectId
}

export class CartItem {
  _id?: ObjectId
  item: ItemType
  cart_id: ObjectId

  constructor(data: CartItemType) {
    this.item = data.item
    this._id = data._id
    this.cart_id = data.cart_id
  }
}

export default class Cart {
  _id?: ObjectId
  user_id: ObjectId

  constructor(data: CartType) {
    this.user_id = data.user_id
    this._id = data._id
  }
}
