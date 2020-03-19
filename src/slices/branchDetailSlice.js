import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  branchName: '',
  coName: '',
  isVisible: true,
  isTableVisible: false,
  selectedCategories: []
}

const branchDetailSlice = createSlice({
  name: 'branchData',
  initialState,
  reducers: {
    setBranchName(state, action) {
      state.branchName = action.payload
    },
    setCOName(state, action) {
      state.coName = action.payload
    },
    toggleVisibility(state) {
      state.isVisible = !state.isVisible
    },
    showTable(state) {
      state.isTableVisible = !state.isTableVisible
    },
    selectCategory(state, action) {
      state.selectedCategories = action.payload
    }
  }
})

export const {
  toggleVisibility,
  showTable,
  selectCategory,
  setBranchName,
  setCOName
} = branchDetailSlice.actions

export default branchDetailSlice.reducer
