import { ObjectId } from 'mongodb'

interface ConversationRoomType {
  _id?: ObjectId
  company_id: ObjectId
  user_id: ObjectId
  last_message_id?: ObjectId
}

class ConversationRoom {
  _id?: ObjectId
  company_id: ObjectId
  user_id: ObjectId
  last_message_id?: ObjectId

  constructor(data: ConversationRoomType) {
    this._id = data._id
    this.user_id = data.user_id
    this.company_id = data.company_id
    this.last_message_id = data.last_message_id
  }
}

export default ConversationRoom
