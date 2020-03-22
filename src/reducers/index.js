import { combineReducers } from 'redux'

import branchDetail from 'slices/branchDetailSlice'
import geoData from 'slices/geoDataSlice'
import mapLook from 'slices/mapLookSlice'

const rootReducer = combineReducers({
  mapLook,
  branchDetail,
  geoData
})

export default rootReducer
