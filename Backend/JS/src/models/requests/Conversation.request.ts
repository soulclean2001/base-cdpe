import { ParamsDictionary } from 'express-serve-static-core'

export interface GetConversationsParams extends ParamsDictionary {
  room_id: string
}

export interface ConversationReqBody {
  content: string
  receiver_id: string
  room_id: string
  sender_id: string
}
