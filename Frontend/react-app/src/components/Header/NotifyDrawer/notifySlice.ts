import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import apiNotify, { RequestNotify } from '~/api/notify.api'
export interface NotificationType {
  _id?: string
  content: string
  type: string
  object_recieve: number
  recievers: string[]
  is_readed?: boolean
  created_at?: string
  updated_at?: string
}
export interface NotifyState {
  notifications: NotificationType[]
  loading: boolean
  error: any
}
interface AnyType {
  [key: string]: any
}

const initialState: NotifyState = {
  notifications: [],
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
      state.notifications = result
      state.loading = false
      state.error = ''
      return state
    })
  },
  reducers: {
    setIsRead: (state, action) => {
      state.notifications = state.notifications.map((notify) => {
        if (notify._id === action.payload) notify.is_readed = true
        return notify
      })
      return state
    },
    setNotifications: (state, action) => {
      state.notifications = [action.payload]
      return state
    },
    addNotify: (state, action) => {
      state.notifications = [...state.notifications, action.payload]
      return state
    }
  }
})

export const { setIsRead, addNotify, setNotifications } = notifySlice.actions

export default notifySlice.reducer
