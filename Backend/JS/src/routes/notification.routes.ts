import express from 'express'
import notificationControllers from '~/controllers/notification.controllers'

import { accessTokenValidator } from '~/middlewares/users.middlewares'

const notificationRouter = express.Router()

notificationRouter.get('/', accessTokenValidator, notificationControllers.getNotifications)
notificationRouter.post('/:notification_id', accessTokenValidator, notificationControllers.seeNotification)

export default notificationRouter
