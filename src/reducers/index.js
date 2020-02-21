import { combineReducers } from 'redux'

import mapStyle from './mapStyle'
import branchDetailSlice from '../slices/branchDetailSlice'

const rootReducer = combineReducers({
  mapStyle,
  branchDetailSlice
})

export default rootReducer
