import { UserRole } from '~/constants/enums'
import databaseServices from './database.services'
import Notification, { NotificationObject, NotificationType } from '~/models/schemas/Notification.schema'
import { io } from '..'
import { ObjectId } from 'mongodb'

class NotificationService {
  static getObjectRecieveFromRole(role: number) {
    switch (role) {
      case UserRole.Administrators: {
        return NotificationObject.Admin
      }
      case UserRole.Employer: {
        return NotificationObject.Employer
      }

      case UserRole.Candidate: {
        return NotificationObject.Candidate
      }

      default: {
        return NotificationObject.All
      }
    }
  }

  static async getNotifications(
    role: number,
    user_id: string,
    filter: {
      page?: string
      limit?: string
    }
  ) {
    const limit = Number(filter.limit) || 10
    const page = Number(filter.page) || 1
    const object_recieve = this.getObjectRecieveFromRole(role)

    const result = await databaseServices.notification
      .find({
        object_recieve,
        recievers: {
          $in: [user_id]
        }
      })
      .sort({
        created_at: -1
      })
      .skip(limit * (page - 1))
      .limit(limit)

      .toArray()

    return result
  }

  static async notify(data: NotificationType) {
    const notification = new Notification({
      ...data
    })

    const result = await databaseServices.notification.insertOne(notification)

    notification._id = result.insertedId

    const recievers = notification.recievers
    const type = notification.type
    const object_recieve = notification.object_recieve
    if (object_recieve === NotificationObject.All) io.emit('new-broadcast-notification', notification)
    else
      for (let i = 0; i < recievers.length; i++) {
        io.to(recievers[i] + '').emit('new-notification', notification)
      }

    return notification
  }

  static async seeNotification(notificationId: string) {
    const result = await databaseServices.notification.updateOne(
      {
        _id: new ObjectId(notificationId)
      },
      {
        $set: {
          is_readed: true
        }
      }
    )

    return {
      _id: result.upsertedId
    }
  }
}

export default NotificationService
