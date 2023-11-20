import { Router } from 'express'
import conversationsControllers from '~/controllers/conversations.controllers'
import { sendMessageValidator } from '~/middlewares/conversation.middlewares'

import { accessTokenValidator, getConversationsValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import wrapAsync from '~/utils/handlers'
import { paginationValidator } from '~/utils/validation'

const conversationsRouter = Router()

conversationsRouter.get(
  '/:room_id',
  accessTokenValidator,
  // verifiedUserValidator,
  paginationValidator,
  getConversationsValidator,
  wrapAsync(conversationsControllers.getConversationsByRoomId)
)

conversationsRouter.get(
  '/rooms/company',
  accessTokenValidator,
  // verifiedUserValidator,
  // paginationValidator,
  wrapAsync(conversationsControllers.getRoomsByCompany)
)

conversationsRouter.get(
  '/rooms/user',
  accessTokenValidator,
  // verifiedUserValidator,
  // paginationValidator,
  wrapAsync(conversationsControllers.getRoomsByUser)
)

conversationsRouter.post(
  '/send-message',
  accessTokenValidator,
  sendMessageValidator,
  wrapAsync(conversationsControllers.sendMessage)
)

export default conversationsRouter
