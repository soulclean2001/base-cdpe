import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import Conversation from '~/models/schemas/Conversation.schema'
import { ErrorWithStatus } from '~/models/Errors'
import { da } from '@faker-js/faker'
import { omit, pick } from 'lodash'
import NotificationService from './notification.services'
import { NotificationObject } from '~/models/schemas/Notification.schema'
import { UserRole } from '~/constants/enums'

export default class ConversationService {
  // static async getConversations({
  //   sender_id,
  //   limit,
  //   page
  // }: {
  //   sender_id: string
  //   limit: number
  //   page: number
  // }) {
  //   const $match = {
  //     $or: [
  //       {
  //         sender_id: new ObjectId(sender_id),
  //         receiver_id: new ObjectId(receiver_id)
  //       },
  //       {
  //         sender_id: new ObjectId(receiver_id),
  //         receiver_id: new ObjectId(sender_id)
  //       }
  //     ]
  //   }

  //   const conversations = await databaseServices.conversations
  //     .find($match)
  //     .sort({ created_at: -1 })
  //     .skip(limit * (page - 1))
  //     .limit(limit)
  //     .toArray()

  //   const total = await databaseServices.conversations.countDocuments($match)

  //   return {
  //     conversations,
  //     total
  //   }
  // }

  static async getRoomsByCompany(userId: string) {
    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })

    if (!company) {
      throw new ErrorWithStatus({
        message: 'Could not find company',
        status: 404
      })
    }

    const rooms = await databaseServices.conversationRooms
      .aggregate([
        {
          $match: {
            company_id: company._id
          }
        },
        {
          $sort: {
            updated_at: -1
          }
        },
        {
          $lookup: {
            from: 'company',
            localField: 'company_id',
            foreignField: '_id',
            as: 'company'
          }
        },
        {
          $unwind: {
            path: '$company'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: {
            path: '$user'
          }
        },
        {
          $project: {
            company: 1,
            user: {
              email: 1,
              username: 1,
              name: 1,
              avatar: 1,
              cover_photo: 1,
              _id: 1
            },
            last_message_id: 1
          }
        }
      ])
      .toArray()
    const result = []
    for (const room of rooms) {
      const conversation = await databaseServices.conversations.findOne({
        _id: room.last_message_id
      })
      room.last_conversation = conversation

      result.push(room)
    }

    return result
  }

  static async getRoomById(roomId: string) {
    const rooms = await databaseServices.conversationRooms
      .aggregate([
        {
          $match: {
            _id: new ObjectId(roomId)
          }
        },
        {
          $sort: {
            updated_at: -1
          }
        },
        {
          $lookup: {
            from: 'company',
            localField: 'company_id',
            foreignField: '_id',
            as: 'company'
          }
        },
        {
          $unwind: {
            path: '$company'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: {
            path: '$user'
          }
        },
        {
          $project: {
            company: 1,
            user: {
              email: 1,
              username: 1,
              name: 1,
              avatar: 1,
              cover_photo: 1,
              _id: 1
            },
            last_message_id: 1
          }
        }
      ])
      .toArray()
    const result = []
    for (const room of rooms) {
      const conversation = await databaseServices.conversations.findOne({
        _id: room.last_message_id
      })
      room.last_conversation = conversation

      result.push(room)
    }

    return result
  }

  static async getRoomsByUser(userId: string) {
    const rooms = await databaseServices.conversationRooms
      .aggregate([
        {
          $match: {
            user_id: new ObjectId(userId)
          }
        },
        {
          $sort: {
            updated_at: -1
          }
        },
        {
          $lookup: {
            from: 'company',
            localField: 'company_id',
            foreignField: '_id',
            as: 'company'
          }
        },
        {
          $unwind: {
            path: '$company'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: {
            path: '$user'
          }
        },
        {
          $project: {
            company: 1,
            user: {
              email: 1,
              username: 1,
              name: 1,
              avatar: 1,
              cover_photo: 1,
              _id: 1
            },
            last_message_id: 1
          }
        }
      ])
      .toArray()
    const result = []
    for (const room of rooms) {
      const conversation = await databaseServices.conversations.findOne({
        _id: room.last_message_id
      })
      room.last_conversation = conversation

      result.push(room)
    }

    return result
  }

  static async getRoomByUser(userId: string, roomId: string) {
    const rooms = await databaseServices.conversationRooms
      .aggregate([
        {
          $match: {
            user_id: new ObjectId(userId),
            _id: new ObjectId(roomId)
          }
        },
        {
          $sort: {
            updated_at: -1
          }
        },
        {
          $lookup: {
            from: 'company',
            localField: 'company_id',
            foreignField: '_id',
            as: 'company'
          }
        },
        {
          $unwind: {
            path: '$company'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: {
            path: '$user'
          }
        },
        {
          $project: {
            company: 1,
            user: {
              email: 1,
              username: 1,
              name: 1,
              avatar: 1,
              cover_photo: 1,
              _id: 1
            },
            last_message_id: 1
          }
        }
      ])
      .toArray()
    const result = []
    for (const room of rooms) {
      const conversation = await databaseServices.conversations.findOne({
        _id: room.last_message_id
      })
      room.last_conversation = conversation

      result.push(room)
    }

    return result
  }

  static async getConversationsByRoomId(userId: string, roomId: string, limit: number = 12, page: number = 1) {
    const roomFromUser = await databaseServices.conversationRooms.findOne({
      _id: new ObjectId(roomId),
      user_id: new ObjectId(userId)
    })

    const company = await databaseServices.company.findOne({
      'users.user_id': new ObjectId(userId)
    })

    if (!roomFromUser) {
      if (!company) {
        throw new ErrorWithStatus({
          message: 'You are not owner this conversation and not in the company',
          status: 404
        })
      }
      const roomFromCompany = await databaseServices.conversationRooms.findOne({
        _id: new ObjectId(roomId),
        company_id: company._id
      })

      if (!roomFromCompany) {
        throw new ErrorWithStatus({
          message: 'You are not owner this conversation',
          status: 404
        })
      }
    }

    const [conversations, total] = await Promise.all([
      databaseServices.conversations
        .aggregate([
          {
            $match: {
              room_id: new ObjectId(roomId)
            }
          },
          {
            $sort: {
              created_at: -1
            }
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      await databaseServices.conversations
        .aggregate([
          {
            $match: {
              room_id: new ObjectId('6524c00b2c484441f6e681d8')
            }
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])

    const rooms = await ConversationService.getRoomById(roomId)
    let infor_receiver = {}

    if (rooms.length > 0) {
      infor_receiver = !roomFromUser ? rooms[0].user : rooms[0].company
    }

    return {
      conversations,
      total: total[0]?.total || 0,
      limit,
      page,
      infor_receiver
    }
  }

  static async sendMessage({ sender_id, content, room_id }: { sender_id: string; content: string; room_id: string }) {
    const conversation = new Conversation({
      sender_id: new ObjectId(sender_id),
      content: content,
      room_id: new ObjectId(room_id)
    })
    const result = await databaseServices.conversations.insertOne(conversation)

    conversation._id = result.insertedId

    const room = await databaseServices.conversationRooms.findOneAndUpdate(
      {
        _id: conversation.room_id
      },
      {
        $set: {
          last_message_id: result.insertedId
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )

    if (room && room.value) {
      const isUserSend = room.value.user_id.toString() === sender_id ? true : false
      let recievers: string[] = []
      let isAdmin = false

      if (isUserSend) {
        const user = await databaseServices.users.findOne({
          _id: new ObjectId(sender_id)
        })
        isAdmin = user?.role === UserRole.Administrators ? true : false

        const company = await databaseServices.company.findOne({
          _id: room.value.company_id
        })

        recievers = company?.users.map((user) => user.user_id.toString()) || []
      } else {
        recievers = [room.value.user_id.toString()]
      }

      const object_recieve = isUserSend
        ? isAdmin
          ? NotificationObject.Admin
          : NotificationObject.Employer
        : NotificationObject.Candidate

      if (recievers.length > 0)
        await NotificationService.notify({
          content: `Bạn có 1 tin nhắn mới từ ${
            isUserSend ? (isAdmin ? 'quản trị viên' : 'ứng viên') : 'nhà tuyển dụng'
          }`,
          object_recieve,
          recievers,
          type: 'chat'
        })
    }

    return conversation
  }
}
