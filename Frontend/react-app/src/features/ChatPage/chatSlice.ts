import { createSlice } from '@reduxjs/toolkit'

interface RoomType {
  _id: string
  last_conversation: object
  user: object //
  company: object //
}

interface ConversationType {
  _id: string
  sender_id: string
  content: string
  created_at: string
  updated_at: string
  room_id: string
}

interface ChatType {
  conversations: ConversationType[]
  total: number
  limit: number
  page: number
}

const initialState: {
  rooms: RoomType[]
  messages: ChatType
  currentRoom?: RoomType
} = {
  rooms: [],
  messages: {
    conversations: [],
    total: 0,
    limit: 12,
    page: 1
  }
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,

  reducers: {
    setMessage(state, action) {
      state.messages = action.payload
      return state
    },

    addMessage(state, action) {
      const current = state.currentRoom?._id
      const message = action.payload
      if (current === message.room_id) state.messages.conversations = [message, ...state.messages.conversations]

      const roomHasNewMsg = state.rooms.find((room) => room._id === message.room_id)

      if (!roomHasNewMsg) return state

      const rooms = state.rooms.filter((room) => message.room_id !== room._id)
      roomHasNewMsg.last_conversation = message
      const newRooms = [roomHasNewMsg, ...rooms]
      state.rooms = newRooms
      return state
    },

    addMoreMessage(state, action) {
      const current = state.currentRoom?._id
      const messages = action.payload
      if (current) {
        state.messages.conversations = [...state.messages.conversations, ...messages.conversations]
        state.messages.page = messages.page
      }
      return state
    },

    setCurrentRoom(state, action) {
      state.currentRoom = action.payload
      return state
    },

    setRooms(state, action) {
      state.rooms = action.payload
      return state
    }
  }
})

export const { setMessage, addMessage, setCurrentRoom, setRooms, addMoreMessage } = chatSlice.actions

export default chatSlice.reducer
