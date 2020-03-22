import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  colorScheme: 'red',
  colorScaleType: 'sequential',
  mapboxStyle: 'light-v8'
}

const mapLookSlice = createSlice({
  name: 'mapLookout',
  initialState,
  reducers: {
    setColorScheme(state, action) {
      state.colorScheme = action.payload
    },
    setColorScaleType(state, action) {
      state.colorScaleType = action.payload
    },
    setMapboxStyle(state, action) {
      state.mapboxStyle = action.payload
    }
  }
})

export const { setColorScheme, setMapboxStyle, setColorScaleType } = mapLookSlice.actions

export default mapLookSlice.reducer
