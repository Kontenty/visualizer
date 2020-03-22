import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
// import logger from 'redux-logger'
import rootReducer from './reducers'

const storeDev = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware()]
})

const storeProd = configureStore({
  reducer: rootReducer,
  devTools: false
})

export default process.env.NODE_ENV === 'production' ? storeProd : storeDev
