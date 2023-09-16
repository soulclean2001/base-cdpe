import { Router } from 'express'
import conversationsControllers from '~/controllers/conversations.controllers'

import { accessTokenValidator, getConversationsValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import wrapAsync from '~/utils/handlers'
import { paginationValidator } from '~/utils/validation'

const conversationsRouter = Router()

conversationsRouter.get(
  '/receivers/:receiver_id',
  accessTokenValidator,
  verifiedUserValidator,
  paginationValidator,
  getConversationsValidator,
  wrapAsync(conversationsControllers.getConversationsController)
)

export default conversationsRouter
