import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { LoginData } from '../JobSeeker/pages/LoginCandidate'
import auth from '~/api/auth.api'
import { RootState } from '~/app/store'

export interface AuthState {
  loading: boolean
  refreshToken: string
  accessToken: string
  error: string | undefined
  isLogin: boolean
}

interface AuthPayload {
  accessToken: string
  refreshToken: string
}

const initialState: AuthState = {
  loading: false,
  refreshToken: '',
  accessToken: '',
  error: undefined,
  isLogin: false
}
export const postLogin = createAsyncThunk('login/postLogin', (data: LoginData) => {
  return auth.loginApi(data)
})

const authSlice = createSlice({
  name: 'login',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(postLogin.pending, (state) => {
      state.loading = true
    })
    builder.addCase(postLogin.rejected, (state) => {
      state.loading = false
    })
    builder.addCase(postLogin.fulfilled, (state, action) => {
      const { access_token, refresh_token } = action.payload.data || action.payload

      state.accessToken = access_token
      state.refreshToken = refresh_token
      state.isLogin = true
      state.loading = false
      return state
    })
  },
  reducers: {}
})

export default authSlice.reducer
