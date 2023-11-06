import express from 'express'
import notificationControllers from '~/controllers/notification.controllers'

import { accessTokenValidator } from '~/middlewares/users.middlewares'
import wrapAsync from '~/utils/handlers'

const notificationRouter = express.Router()

notificationRouter.get('/', accessTokenValidator, wrapAsync(notificationControllers.getNotifications))
notificationRouter.post('/:notification_id', accessTokenValidator, wrapAsync(notificationControllers.seeNotification))

export default notificationRouter
