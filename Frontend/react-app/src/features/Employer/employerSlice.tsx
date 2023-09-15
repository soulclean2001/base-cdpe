import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface EmployerState {
  collapsed: boolean
}

const initialState: EmployerState = {
  collapsed: false
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
    }
  }
})

// Action creators are generated for each case reducer function
export const { handleChangeSideBar, handleAutoChangeSideBarByWidth } = employerSlice.actions

export default employerSlice.reducer
