import { ObjectId } from 'mongodb'

interface ConversationRoomType {
  _id?: ObjectId
  company_id: ObjectId
  user_id: ObjectId
  last_message_id?: ObjectId
  created_at?: Date
  updated_at?: Date
}

class ConversationRoom {
  _id?: ObjectId
  company_id: ObjectId
  user_id: ObjectId
  last_message_id?: ObjectId
  created_at: Date
  updated_at: Date

  constructor(data: ConversationRoomType) {
    const now = new Date()
    this._id = data._id
    this.user_id = data.user_id
    this.company_id = data.company_id
    this.last_message_id = data.last_message_id
    this.created_at = data.created_at || now
    this.updated_at = data.updated_at || now
  }
}

export default ConversationRoom
