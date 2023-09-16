import { Server, Socket } from 'socket.io'
import { UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/User.request'
import ConversationService from '~/services/conversation.services'
import { verifyAccessToken } from '~/utils/commons'
const activeConnections: {
  [key: string]: string[]
} = {}

const init = (io: Server) => {
  // middleware for socket connection
  io.use(async (socket, next) => {
    // const { Authorization } = socket.handshake.auth
    // const access_token = Authorization?.split(' ')[1]
    const token = socket.handshake.headers.access_token as string
    const access_token = token?.split(' ')[1]

    try {
      const decoded_authorization = await verifyAccessToken(access_token)
      const { verify } = decoded_authorization as TokenPayload
      if (verify !== UserVerifyStatus.Verified) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.USER_NOT_VERIFIED,
          status: HTTP_STATUS.FORBIDDEN
        })
      }
      // Truyền decoded_authorization vào socket để sử dụng ở các middleware khác
      socket.handshake.auth.decoded_authorization = decoded_authorization
      socket.handshake.auth.access_token = access_token
      next()
    } catch (error) {
      console.log(error)
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
    socket.on('updateToken', (newToken) => {
      // Cập nhật mã token cho kết nối socket
      socket.handshake.auth.access_token = newToken
    })
    //
    socket.on('join', (userId: string) => {
      socket.userId = userId
      socket.join(userId)

      // lưu trạng thái kết nối người dùng
      if (!activeConnections[userId]) {
        activeConnections[userId] = [socket.id]
      } else {
        activeConnections[userId].push(socket.id)
      }
    })

    socket.on('send_message', async (data) => {
      const { receiver_id, sender_id, content } = data.payload

      const conversation = await ConversationService.sendMessage({ sender_id, receiver_id, content })
      if (activeConnections[receiver_id]) {
        for (const socketid of activeConnections[receiver_id]) {
          socket.to(socketid).emit('receive_message', {
            payload: conversation
          })
        }
      }
    })

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