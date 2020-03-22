import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  branchName: '',
  coName: '',
  isVisible: true,
  isTableVisible: false,
  selectedCategories: [],
  normMinMax: [],
  sumPerZone: []
}

const branchDetail = createSlice({
  name: 'branchData',
  initialState,
  reducers: {
    setBranchName(state, action) {
      state.branchName = action.payload
    },
    setCOName(state, action) {
      state.coName = action.payload
    },
    clearOut(state) {
      state.branchName = ''
      state.coName = ''
      state.selectedCategories = []
    },
    toggleVisibility(state) {
      state.isVisible = !state.isVisible
    },
    showTable(state) {
      state.isTableVisible = !state.isTableVisible
    },
    selectCategory(state, action) {
      state.selectedCategories = action.payload
    },
    setMinMax(state, action) {
      state.normMinMax = action.payload
    },
    setSumPerZone(state, action) {
      state.sumPerZone = action.payload
    }
  }
})

export const {
  toggleVisibility,
  showTable,
  selectCategory,
  setBranchName,
  setCOName,
  clearOut,
  setMinMax,
  setSumPerZone
} = branchDetail.actions

export default branchDetail.reducer
