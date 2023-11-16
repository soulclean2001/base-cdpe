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

    const data = []
    for (let i = 0; i < result.length; i++) {
      const noti = result[i]
      if (noti.object_sent === NotificationObject.Employer) {
        const company = await databaseServices.company.findOne({
          'users.user_id': noti.sender
        })

        const sender_info: {
          name?: string
          avatar?: string
          sender?: ObjectId
          company_id?: ObjectId
        } = {
          name: company?.company_name,
          avatar: company?.logo,
          sender: noti.sender,
          company_id: company?._id
        }

        const newObject = { ...noti, sender_info, sender: undefined }
        data.push(newObject)
      } else if (noti.object_sent === NotificationObject.Candidate) {
        const user = await databaseServices.users.findOne({
          _id: noti.sender
        })

        const sender_info: {
          name?: string
          avatar?: string
          sender?: ObjectId
        } = {
          name: user?.name,
          avatar: user?.avatar,
          sender: noti.sender
        }

        const newObject = { ...noti, sender_info, sender: undefined }
        data.push(newObject)
      } else if (noti.object_sent === NotificationObject.Admin) {
        const sender_info: {
          name?: string
          avatar?: string
        } = {
          name: 'ADMIN',
          avatar: 'ADMIN'
        }

        const newObject = { ...noti, sender_info }
        data.push(newObject)
      }
    }

    return data
  }

  static async getTotalUnread(role: number, user_id: string) {
    const object_recieve = this.getObjectRecieveFromRole(role)

    const result = await databaseServices.notification
      .aggregate([
        {
          $match: {
            object_recieve,
            recievers: {
              $in: [user_id]
            },
            is_readed: false
          }
        },
        {
          $count: 'total'
        }
      ])

      .toArray()

    return result[0]?.total || 0
  }

  static async notify(data: NotificationType, additionData?: { [key: string]: any }) {
    const notification = new Notification(
      {
        ...data
      },
      additionData
    )

    const result = await databaseServices.notification.insertOne(notification)

    notification._id = result.insertedId

    const recievers = notification.recievers
    const type = notification.type
    const object_recieve = notification.object_recieve
    let notifycation2 = {}
    if (data.object_sent === NotificationObject.Employer) {
      const company = await databaseServices.company.findOne({
        'users.user_id': data.sender
      })

      const sender_info: {
        name?: string
        avatar?: string
        sender?: ObjectId
        company_id?: ObjectId
      } = {
        name: company?.company_name,
        avatar: company?.logo,
        sender: data.sender,
        company_id: company?._id
      }

      notifycation2 = { ...notification, sender_info, sender: undefined }
    } else if (data.object_sent === NotificationObject.Candidate) {
      const user = await databaseServices.users.findOne({
        _id: data.sender
      })

      const sender_info: {
        name?: string
        avatar?: string
        sender?: ObjectId
      } = {
        name: user?.name,
        avatar: user?.avatar,
        sender: data.sender
      }

      notifycation2 = { ...notification, sender_info, sender: undefined }
    } else if (data.object_sent === NotificationObject.Admin) {
      const sender_info: {
        name?: string
        avatar?: string
      } = {
        name: 'ADMIN',
        avatar: 'ADMIN'
      }

      notifycation2 = { ...notification, sender_info }
    }

    if (object_recieve === NotificationObject.All) io.emit('new-broadcast-notification', notifycation2)
    else
      for (let i = 0; i < recievers.length; i++) {
        io.to(recievers[i] + '').emit('new-notification', notifycation2)
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
