import { combineReducers } from 'redux'

import branchDetailSlice from 'slices/branchDetailSlice'
import geoDataSlice from 'slices/geoDataSlice'
import mapLookSlice from 'slices/mapLookSlice'

const rootReducer = combineReducers({
  mapLook: mapLookSlice,
  branchDetailSlice,
  geoData: geoDataSlice
})

export default rootReducer
