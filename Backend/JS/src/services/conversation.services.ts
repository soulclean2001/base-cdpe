import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import Conversation from '~/models/schemas/Conversation.schema'
import { ErrorWithStatus } from '~/models/Errors'
import { da } from '@faker-js/faker'

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

    if (!roomFromUser) {
      const company = await databaseServices.company.findOne({
        'users.user_id': new ObjectId(userId)
      })

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
    return {
      conversations,
      total: total[0]?.total || 0,
      limit,
      page
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

    await databaseServices.conversationRooms.findOneAndUpdate(
      {
        _id: conversation.room_id
      },
      {
        $set: {
          last_message_id: result.insertedId
        }
      }
    )
    return conversation
  }
}
