import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { stat } from 'fs'
import apiNotify, { RequestNotify } from '~/api/notify.api'
import avatarTemp from '~/assets/HF_logo.jpg'
export interface NotificationType {
  _id?: string
  content: string
  type: string
  object_recieve: number
  object_sent: number
  sender?: string
  recievers: string[]
  is_readed?: boolean
  created_at?: string
  updated_at?: string
  sender_info?: { avatar?: string; name?: string; sender?: string }
}
export interface NotifyState {
  notifications: NotificationType[]
  page: number
  totalNotRead: number
  loading: boolean
  error: any
}
interface AnyType {
  [key: string]: any
}

const initialState: NotifyState = {
  notifications: [],
  page: 0,
  totalNotRead: 0,
  loading: false,
  error: undefined
}
export const getAllByMe = createAsyncThunk('notify/getAllByMe', async (request: RequestNotify, { rejectWithValue }) => {
  try {
    const rs = await apiNotify.getAllByMe(request)
    return rs
  } catch (error) {
    return rejectWithValue(error)
  }
})

const notifySlice = createSlice({
  name: 'notify',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getAllByMe.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getAllByMe.rejected, (state, action) => {
      state.loading = false
      const payload = action.payload
      state.error = payload
    })
    builder.addCase(getAllByMe.fulfilled, (state, action) => {
      const { result, message } = action.payload
      state.page = 1
      state.notifications = result
        .map((notify: NotificationType) => {
          if (notify.type === 'cv/seen') notify.content = notify.content
          if (notify.type === 'post/created')
            notify.content = `Nhà tuyển dụng '...' vừa đăng tin tuyển dụng '${notify.content}'`
          if (notify.type === 'post/approved') {
            notify.content = `Hệ thống phê duyệt tin tuyển dụng '${notify.content}'`
            notify.sender_info = { ...notify.sender_info, avatar: avatarTemp }
          }
          if (notify.type === 'post/rejected') {
            notify.content = `Hệ thống từ chối phê duyệt tin tuyển dụng '${notify.content}'`
            notify.sender_info = { ...notify.sender_info, avatar: avatarTemp }
          }

          if (notify.type === 'post/pending')
            notify.content = `Bài tuyển dụng ${notify.content} đã được gửi yêu cầu kiểm duyệt`

          return notify
        })
        .reverse()
      state.loading = false
      state.error = ''
      return state
    })
  },
  reducers: {
    setIsRead: (state, action) => {
      state.notifications = state.notifications.map((notify) => {
        if (notify._id === action.payload) {
          notify.is_readed = true
          state.totalNotRead = state.totalNotRead - 1
        }
        return notify
      })
      return state
    },
    setMoreWhenScroll: (state, action) => {
      state.notifications = [...state.notifications, ...action.payload]
      state.page = ++state.page
      return state
    },
    addNotify: (state, action) => {
      state.notifications = [...state.notifications, action.payload]
      state.totalNotRead = state.totalNotRead + 1
      return state
    },
    setTotalUnRead: (state, action) => {
      state.totalNotRead = action.payload
      return state
    }
  }
})

export const { setIsRead, addNotify, setMoreWhenScroll, setTotalUnRead } = notifySlice.actions

export default notifySlice.reducer
