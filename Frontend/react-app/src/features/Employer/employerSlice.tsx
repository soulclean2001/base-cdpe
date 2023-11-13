import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import apiCart from '~/api/cart.api'
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
  cart: {
    idCart: string
    totalItems: number
    loading: boolean
    error: any
  }
}

const initialState: EmployerState = {
  collapsed: false,
  posts: {
    total: 0,
    limit: 0,
    page: 0,
    data: []
  },
  cart: {
    idCart: '',
    totalItems: 0,
    loading: false,
    error: ''
  }
}
export const getMyCart = createAsyncThunk('employer/getMyCart', async (_, { rejectWithValue }) => {
  try {
    const rs = await apiCart.getMyCart()
    return rs
  } catch (error) {
    return rejectWithValue(error)
  }
})
export const getItemsCart = createAsyncThunk('employer/getItemsCart', async (_, { rejectWithValue }) => {
  try {
    const rs = await apiCart.getAllByMe()
    return rs
  } catch (error) {
    return rejectWithValue(error)
  }
})
export const employerSlice = createSlice({
  name: 'employer',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getMyCart.pending, (state) => {
      state.cart.loading = true
    })
    builder.addCase(getMyCart.rejected, (state, action) => {
      state.cart.loading = false
      const payload = action.payload
      state.cart.error = payload
    })
    builder.addCase(getMyCart.fulfilled, (state, action) => {
      const { result } = action.payload

      state.cart.idCart = result._id

      state.cart.loading = false
      state.cart.error = ''
      return state
    })
    builder.addCase(getItemsCart.pending, (state) => {
      state.cart.loading = true
    })
    builder.addCase(getItemsCart.rejected, (state, action) => {
      state.cart.loading = false
      const payload = action.payload
      state.cart.error = payload
    })
    builder.addCase(getItemsCart.fulfilled, (state, action) => {
      const { result } = action.payload

      state.cart.totalItems = result.length

      state.cart.loading = false
      state.cart.error = ''
      return state
    })
  },
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
    setDataPosts: (state, action) => {
      state.posts.data = action.payload
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
    },
    plusTotalItemCart: (state) => {
      state.cart.totalItems = state.cart.totalItems + 1
    },
    minusTotalItemCart: (state) => {
      state.cart.totalItems = state.cart.totalItems - 1
    }
  }
})

// Action creators are generated for each case reducer function
export const {
  handleChangeSideBar,
  handleAutoChangeSideBarByWidth,
  setPosts,
  addPost,
  deletePost,
  setDataPosts,
  plusTotalItemCart,
  minusTotalItemCart
} = employerSlice.actions

export default employerSlice.reducer
