import { ObjectId } from 'mongodb'

interface ConversationType {
  _id?: ObjectId
  sender_id: ObjectId
  content: string
  created_at?: Date
  updated_at?: Date
  room_id: ObjectId
}

export default class Conversation {
  _id?: ObjectId
  sender_id: ObjectId
  content: string
  created_at: Date
  updated_at: Date
  room_id: ObjectId
  constructor({ _id, sender_id, content, created_at, updated_at, room_id }: ConversationType) {
    const date = new Date()
    this._id = _id
    this.sender_id = sender_id
    this.content = content
    this.created_at = created_at || date
    this.updated_at = updated_at || date
    this.room_id = room_id
  }
}
