import { ObjectId } from 'mongodb'
import { Server, Socket } from 'socket.io'
import { UserRole, UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/User.request'
import ConversationService from '~/services/conversation.services'
import databaseServices from '~/services/database.services'
import { verifyAccessToken } from '~/utils/commons'
export const activeConnections: {
  [key: string]: string[]
} = {}

const init = (io: Server) => {
  // middleware for socket connection
  io.use(async (socket, next) => {
    const { Authorization } = socket.handshake.auth
    const access_token = Authorization?.split(' ')[1]

    // header
    // const token = socket.handshake.headers.access_token as string
    // const access_token = token?.split(' ')[1]

    try {
      const decoded_authorization = await verifyAccessToken(access_token)
      const { verify } = decoded_authorization as TokenPayload
      // kiểm tra xem user verify
      // if (verify !== UserVerifyStatus.Verified) {
      //   throw new ErrorWithStatus({
      //     message: USERS_MESSAGES.USER_NOT_VERIFIED,
      //     status: HTTP_STATUS.FORBIDDEN
      //   })
      // }
      // Truyền decoded_authorization vào socket để sử dụng ở các middleware khác
      socket.handshake.auth.decoded_authorization = decoded_authorization
      socket.handshake.auth.access_token = access_token
      next()
    } catch (error) {
      console.log('error', error)
      next({
        message: 'Unauthorized',
        name: 'UnauthorizedError',
        data: error
      })
    }
  })

  io.on('connection', (socket) => {
    console.log('one client is connected with socket: ', socket.id)

    // middleware for listening events
    socket.use(async (packet, next) => {
      const { access_token } = socket.handshake.auth
      try {
        await verifyAccessToken(access_token)
        next()
      } catch (error) {
        next(new Error('Unauthorized'))
      }
    })

    socket.on('error', (error) => {
      if (error.message === 'Unauthorized') {
        socket.disconnect()
      }
    })
    socket.on('update_token', (newToken) => {
      // Cập nhật mã token cho kết nối socket

      socket.handshake.auth.access_token = newToken
      console.log('update token', socket.handshake.auth.access_token)
    })

    socket.on(
      'change-job-from-employer',
      async (data: { companyId: string; jobId: string; status: string; command: string }) => {
        const company = await databaseServices.company.findOne({
          _id: new ObjectId(data.companyId)
        })

        if (!company) return

        const users = await databaseServices.users
          .find({
            role: UserRole.Administrators
          })
          .toArray()

        const userIds = users.map((user) => user._id.toString())

        for (let i = 0; i < userIds.length; i++) {
          socket.to(userIds[i]).emit('change-job', data)
        }
      }
    )

    socket.on(
      'change-job-from-admin',
      async (data: { companyId: string; jobId: string; status: string; command: string }) => {
        const company = await databaseServices.company.findOne({
          _id: new ObjectId(data.companyId)
        })

        if (!company) return

        for (let i = 0; i < company.users.length; i++) {
          socket.to(company.users[i].toString()).emit('change-job', data)
        }
      }
    )

    //

    socket.on('join', (userId: string) => {
      // lưu trạng thái kết nối người dùng
      if (userId) {
        socket.userId = userId
        socket.join(userId)
        if (!activeConnections[userId]) {
          activeConnections[userId] = [socket.id]
        } else {
          activeConnections[userId].push(socket.id)
        }
      }

      console.log(activeConnections)
    })

    socket.on('join-conversations', (roomIds) => {
      roomIds.forEach((id: string) => socket.join(id))
      console.log(roomIds)
    })

    socket.on('join-room', (roomId) => {
      socket.join(roomId)
    })
    // socket.on('send_message', async (data) => {
    //   const { receiver_id, sender_id, content, room_id } = data.payload

    //   const conversation = await ConversationService.sendMessage({ sender_id, receiver_id, content, room_id })
    //   if (activeConnections[receiver_id]) {
    //     for (const socketid of activeConnections[receiver_id]) {
    //       socket.to(socketid).emit('receive_message', {
    //         payload: conversation
    //       })
    //     }
    //   }
    // })

    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`)
      disconnect(socket)
    })
  })
}

const disconnect = (socket: Socket) => {
  // Kiểm tra xem còn kết nối nào khác của người dùng không

  if (activeConnections[socket.userId]) {
    const index = activeConnections[socket.userId].indexOf(socket.id)
    if (index !== -1) {
      activeConnections[socket.userId].splice(index, 1)
    }

    // Nếu không còn kết nối nào của người dùng, thì rời khỏi phòng
    if (activeConnections[socket.userId].length === 0) {
      socket.leave(socket.userId)
      delete activeConnections[socket.userId]
    }
  }
}

export default init
