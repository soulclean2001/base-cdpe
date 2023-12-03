import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Socket } from 'socket.io-client'
export interface User {
  id: string
  name: string
  email: string
}
export interface UserState {
  loading: boolean
  users: Array<User>
  error: string | undefined
  socket?: Socket
}
const initialState: UserState = {
  loading: false,
  users: [],
  error: undefined
}
export const fetchUsers = createAsyncThunk('users/fetchUsers', () => {
  const res = fetch('https://jsonplaceholder.typicode.com/users').then((data) => data.json())
  return res
})
const userSlice = createSlice({
  name: 'users',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<Array<User>>) => {
      state.loading = false
      state.users = action.payload
    })
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false
      state.users = []
      state.error = action.error.message
    })
  },
  reducers: {
    setSocket(state, action) {
      state.socket = action.payload
      return state
    }
  }
})
// export const userSelector = (state: RootState) =>
export const { setSocket } = userSlice.actions
export default userSlice.reducer
