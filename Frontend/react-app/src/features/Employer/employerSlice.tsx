import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface AnyTypePost {
  [key: string]: any
}

export interface EmployerState {
  collapsed: boolean
  posts: {
    total: number
    limit: number
    page: number
    data: AnyTypePost[]
  }
}

const initialState: EmployerState = {
  collapsed: false,
  posts: {
    total: 0,
    limit: 0,
    page: 0,
    data: []
  }
}

export const employerSlice = createSlice({
  name: 'employer',
  initialState,
  reducers: {
    handleChangeSideBar: (state) => {
      state.collapsed = !state.collapsed
    },
    handleAutoChangeSideBarByWidth: (state, action: PayloadAction<boolean>) => {
      state.collapsed = action.payload
    },
    setPosts: (state, action) => {
      state.posts = action.payload
      return state
    },

    addPost: (state, action) => {
      action.payload.created_at = new Date().toISOString()
      state.posts.data = [...state.posts.data, action.payload]
      state.posts.total += 1
      return state
    },

    deletePost: (state, action) => {
      const newPosts = state.posts.data.filter((post) => post.id !== action.payload)

      state.posts.data = [...newPosts]
      state.posts.total -= 1
      return state
    }
  }
})

// Action creators are generated for each case reducer function
export const { handleChangeSideBar, handleAutoChangeSideBarByWidth, setPosts, addPost, deletePost } =
  employerSlice.actions

export default employerSlice.reducer
