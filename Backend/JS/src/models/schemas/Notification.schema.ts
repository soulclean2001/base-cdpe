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
  object_sent: NotificationObject
  sender?: ObjectId
  recievers: string[]
  is_readed?: boolean
  created_at?: Date
  updated_at?: Date
  [key: string]: any
}

class Notification {
  _id?: ObjectId
  content: string
  type: string
  sender?: ObjectId
  object_recieve: NotificationObject
  object_sent: NotificationObject
  recievers: string[]
  is_readed: boolean
  created_at: Date
  updated_at: Date;
  [key: string]: any

  constructor(data: NotificationType, additionalData?: { [key: string]: any }) {
    const now = new Date()
    this._id = data._id
    this.content = data.content
    this.type = data.type
    this.object_recieve = data.object_recieve
    this.object_sent = data.object_sent
    this.recievers = data.recievers
    this.sender = data.sender
    this.is_readed = data.is_readed || false
    this.created_at = data.created_at || now
    this.updated_at = data.updated_at || now
    for (const key in additionalData) {
      this[key] = additionalData[key]
    }
  }
}

export default Notification
