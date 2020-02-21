import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isVisible: false,
  isTableVisible: false,
  columns: [
    'Internal flows [MW]',
    'Loop flows [MW]',
    'Export/import flows [MW]',
    'Transit flows [MW]',
    'PST flows [MW]'
  ],
  selectedCategories: []
}

const branchDetailSlice = createSlice({
  name: 'branchData',
  initialState,
  reducers: {
    toggleVisibility(state) {
      state.isVisible = !state.isVisible
    },
    showTable(state) {
      state.isTableVisible = !state.isTableVisible
    },
    selectZone(state, action) {
      state.selectedCategories = action.payload
    }
  }
})

export const { toggleVisibility, showTable, selectZone } = branchDetailSlice.actions

export default branchDetailSlice.reducer
