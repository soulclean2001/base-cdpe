import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/User.request'
import NotificationService from '~/services/notification.services'

class NotificationController {
  async getNotifications(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id, role } = req.decoded_authorization as TokenPayload

    const result = await NotificationService.getNotifications(role, user_id, req.query)

    return res.json({
      message: 'Notification',
      result
    })
  }

  async seeNotification(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { notification_id } = req.params

    if (!ObjectId.isValid(notification_id))
      throw new ErrorWithStatus({
        message: 'Invalid notification id',
        status: 405
      })

    const result = await NotificationService.seeNotification(notification_id)

    return res.json({
      message: 'See Notification',
      result
    })
  }

  async getTotalUnread(req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) {
    const { user_id, role } = req.decoded_authorization as TokenPayload

    const result = await NotificationService.getTotalUnread(role, user_id)

    return res.json({
      message: 'Total Notification Unread',
      result
    })
  }
}

export default new NotificationController()
