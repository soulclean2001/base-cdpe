import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'
import { ConversationReqBody, GetConversationsParams } from '~/models/requests/Conversation.request'
import { TokenPayload } from '~/models/requests/User.request'
import ConversationService from '~/services/conversation.services'
import { io } from '..'

class ConversationController {
  // async getConversationsController(req: Request<GetConversationsParams>, res: Response) {
  //   const queries = req.query
  //   const limit = Number(queries.limit)
  //   const page = Number(queries.page)
  //   const { receiver_id } = req.params
  //   const sender_id = (req.decoded_authorization as TokenPayload).user_id
  //   const result = await ConversationService.getConversations({
  //     sender_id,
  //     limit,
  //     page
  //   })

  //   return {
  //     message: 'Conversations',
  //     result
  //   }
  // }

  async getRoomsByCompany(req: Request<any>, res: Response) {
    // const queries = req.query
    // const limit = Number(queries.limit)
    // const page = Number(queries.page)
    const user_id = (req.decoded_authorization as TokenPayload).user_id
    const result = await ConversationService.getRoomsByCompany(user_id)

    return res.json({
      message: 'rooms',
      result
    })
  }

  async getRoomsByUser(req: Request<any>, res: Response) {
    // const queries = req.query
    // const limit = Number(queries.limit)
    // const page = Number(queries.page)
    const user_id = (req.decoded_authorization as TokenPayload).user_id
    const result = await ConversationService.getRoomsByUser(user_id)

    return res.json({
      message: 'rooms',
      result
    })
  }

  async getConversationsByRoomId(req: Request<GetConversationsParams, any, any>, res: Response) {
    const queries = req.query
    const { room_id } = req.params
    const limit = Number(queries.limit)
    const page = Number(queries.page)
    const user_id = (req.decoded_authorization as TokenPayload).user_id

    const conversations = await ConversationService.getConversationsByRoomId(user_id, room_id, limit, page)

    return res.json({
      message: 'Conversations',
      result: conversations
    })
  }

  async sendMessage(req: Request<any, ConversationReqBody, any>, res: Response) {
    const sender_id = (req.decoded_authorization as TokenPayload).user_id
    const { room_id, content } = req.body
    if (!ObjectId.isValid(room_id)) {
      throw new ErrorWithStatus({
        message: 'Invalid room',
        status: 403
      })
    }
    const conversation = await ConversationService.sendMessage({
      content,
      room_id,
      sender_id
    })
    if (conversation) io.to(room_id + '').emit('new-message', conversation)

    return res.json({
      message: 'send message'
    })
  }
}

export default new ConversationController()
