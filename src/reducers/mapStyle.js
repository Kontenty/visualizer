import { createReducer } from '@reduxjs/toolkit'

export const mapState = {
  mapboxStyle: 'light-v10'
}

const mapStyle = createReducer(mapState, {
  SET_MAPBOX_STYLE(state, action) {
    state.mapboxStyle = action.payload
  }
})

export default mapStyle
