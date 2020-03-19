import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { addFeature } from 'helpers'

const initialState = {
  euMap: null,
  branchGeo: null,
  branchCenters: null,
  geoDataReady: false
}

const geoDataSlice = createSlice({
  name: 'geoData',
  initialState,
  reducers: {
    setEuMap(state, action) {
      state.euMap = action.payload
    },
    setBranchGeo(state, action) {
      state.branchGeo = action.payload
    },
    setBranchCenters(state, action) {
      state.branchCenters = action.payload
    },
    setReady(state, action) {
      state.geoDataReady = action.payload
    }
  }
})

export const { setEuMap, setBranchGeo, setBranchCenters, setReady } = geoDataSlice.actions

export const fetchGeoData = () => async dispatch => {
  try {
    const res = await axios.all([
      axios.get('./static/europe.geojson'),
      axios.get('./static/20181130_1030.json'),
      axios.get('./static/branchCenters.geojson')
    ])
    dispatch(setEuMap(res[0].data))
    dispatch(setBranchGeo(addFeature(res[1].data)))
    dispatch(setBranchCenters(res[2].data))
    dispatch(setReady(true))
  } catch (error) {
    dispatch(setReady(false))
  }
}

export default geoDataSlice.reducer
