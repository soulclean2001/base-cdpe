import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import auth from '~/api/auth.api'

import { LoginData } from '~/features/JobSeeker/pages/LoginJobSeeker'
import { TokenPayload, UserRole } from '~/types'

export interface AuthState {
  loading: boolean
  refreshToken: string
  accessToken: string
  error: any
  isLogin: boolean
  role: number
  verify: number
  newUser: number
}

interface AuthPayload {
  accessToken: string
  refreshToken: string
}

const initialState: AuthState = {
  role: 0,
  loading: false,
  refreshToken: '',
  accessToken: '',
  error: undefined,
  isLogin: false,
  verify: 0,
  newUser: 1
}
export const postLogin = createAsyncThunk(
  'login/postLogin',
  async (data: Omit<LoginData, 'remember'>, { rejectWithValue }) => {
    try {
      const rs = await auth.loginApi(data)
      return rs
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

const authSlice = createSlice({
  name: 'login',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(postLogin.pending, (state) => {
      state.loading = true
    })
    builder.addCase(postLogin.rejected, (state, action) => {
      state.loading = false
      const payload = action.payload
      state.error = payload
    })
    builder.addCase(postLogin.fulfilled, (state, action) => {
      const { result, message } = action.payload.data || action.payload

      const { access_token, refresh_token, role } = result
      console.log('action', action)
      console.log('role', role)
      state.accessToken = access_token
      // const cookies = new Cookies()
      // cookies.set('refresh_token', refresh_token, {
      // secure: true,
      //   httpOnly: true
      // })
      // console.log(cookies.get('myCat')) // Pacman
      state.refreshToken = refresh_token
      state.isLogin = true
      state.loading = false
      state.role = role
      state.error = ''
      return state
    })
  },
  reducers: {
    setAccountStatus(state, action: PayloadAction<TokenPayload>) {
      const { role, verify, token_type } = action.payload
      state.role = role
      state.verify = verify
      return state
    },
    setToken(state, action: PayloadAction<AuthPayload>) {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      return state
    },
    logout(state) {
      state.accessToken = ''
      state.refreshToken = ''
      state.isLogin = false
      state.verify = 0
      state.error = ''
      return state
    },
    oauth(state, action: PayloadAction<any>) {
      const { accessToken, refreshToken, newUser, verify } = action.payload
      state.accessToken = accessToken
      state.refreshToken = refreshToken
      state.newUser = newUser
      state.verify = verify
      state.role = UserRole.Candidate
      return state
    }
  }
})

export const { setAccountStatus, setToken, logout, oauth } = authSlice.actions

export default authSlice.reducer
