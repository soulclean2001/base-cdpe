import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import me from '~/api/me.api'

export interface InfoMeState {
  id: string
  name: string
  email: string
  username: string
  avatar: string
  loading: boolean
  error: any
}

// interface AuthPayload {
//   accessToken: string
//   refreshToken: string
// }

const initialState: InfoMeState = {
  id: '',
  name: '',
  email: '',
  username: '',
  avatar: '',
  loading: false,
  error: undefined
}
export const getMe = createAsyncThunk('me/getMe', async (_, { rejectWithValue }) => {
  try {
    const rs = await me.getMe()
    return rs
  } catch (error) {
    return rejectWithValue(error)
  }
})

const meSlice = createSlice({
  name: 'me',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getMe.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getMe.rejected, (state, action) => {
      state.loading = false
      const payload = action.payload
      state.error = payload
    })
    builder.addCase(getMe.fulfilled, (state, action) => {
      const { result } = action.payload

      state.email = result.email
      state.id = result._id
      state.name = result.name
      state.username = result.username
      state.avatar = result.avatar
      state.loading = false
      state.error = ''
      return state
    })
  },
  reducers: {
    setMyProfile: (state, action) => {
      state.name = action.payload.name
      state.avatar = action.payload.avatar
      return state
    },
    resetProfile: (state) => {
      state = initialState
      return state
    },
    setLoading: (state, action) => {
      state.loading = action.payload
      return state
    }
  }
})

export const { setMyProfile, resetProfile, setLoading } = meSlice.actions

export default meSlice.reducer
