import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  colorScheme: 'orange',
  mapboxStyle: 'light-v10'
}

const mapLookSlice = createSlice({
  name: 'mapLookout',
  initialState,
  reducers: {
    setColorScheme(state, action) {
      state.colorScheme = action.payload
    },

    setMapboxStyle(state, action) {
      state.mapboxStyle = action.payload
    }
  }
})

export const { setColorScheme, setMapboxStyle } = mapLookSlice.actions

export default mapLookSlice.reducer