import { combineReducers } from 'redux'

import mapStyle from './mapStyle'
import branchDetailSlice from 'slices/branchDetailSlice'
import geoDataSlice from 'slices/geoDataSlice'

const rootReducer = combineReducers({
  mapStyle,
  branchDetailSlice,
  geoData: geoDataSlice
})

export default rootReducer
