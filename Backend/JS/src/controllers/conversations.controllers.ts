import { Request, Response } from 'express'
import { GetConversationsParams } from '~/models/requests/Conversation.request'
import { TokenPayload } from '~/models/requests/User.request'
import ConversationService from '~/services/conversation.services'

class ConversationController {
  async getConversationsController(req: Request<GetConversationsParams>, res: Response) {
    const queries = req.query
    const limit = Number(queries.limit)
    const page = Number(queries.page)
    const { receiver_id } = req.params
    const sender_id = (req.decoded_authorization as TokenPayload).user_id
    const result = await ConversationService.getConversations({
      sender_id,
      receiver_id,
      limit,
      page
    })
  }
}

export default new ConversationController()
