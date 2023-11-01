import { ObjectId } from 'mongodb'

export enum NotificationObject {
  Admin,
  Employer,
  Candidate,
  Conversation,
  All
}

export interface NotificationType {
  _id?: ObjectId
  content: string
  type: string
  object_recieve: NotificationObject
  recievers: string[]
  is_readed?: boolean
  created_at?: Date
  updated_at?: Date
}

class Notification {
  _id?: ObjectId
  content: string
  type: string
  object_recieve: NotificationObject
  recievers: string[]
  is_readed: boolean
  created_at: Date
  updated_at: Date

  constructor(data: NotificationType) {
    const now = new Date()
    this._id = data._id
    this.content = data.content
    this.type = data.type
    this.object_recieve = data.object_recieve
    this.recievers = data.recievers
    this.is_readed = data.is_readed || false
    this.created_at = data.created_at || now
    this.updated_at = data.updated_at || now
  }
}

export default Notification
