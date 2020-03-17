import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  zoneColor: '',
  mapboxStyle: 'light-v10'
}

const mapLookSlice = createSlice({
  name: 'mapLookout',
  initialState,
  reducers: {
    setColorScheme(state, action) {
      state.color = action.payload
    },

    setMapboxStyle(state, action) {
      state.mapboxStyle = action.payload
    }
  }
})

export const { setColorScheme, setMapboxStyle } = mapLookSlice.actions

export default mapLookSlice.reducer
