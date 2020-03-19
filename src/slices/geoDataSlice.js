import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { addFeature } from 'helpers'

const initialState = {
  euMap: null,
  branchGeo: null,
  branchDataName: 'VIZ-DEC_20181121_0630_FO3_UC8_PFC.json',
  branchCenters: null,
  geoDataReady: false
}

const geoDataSlice = createSlice({
  name: 'geoData',
  initialState,
  reducers: {
    initialFetchSuccess(state, action) {
      state.euMap = action.payload
      state.branchGeo = action.payload.branchGeo
      state.branchCenters = action.payload.branchCenters
      state.geoDataReady = true
    },
    setBranchGeo(state, action) {
      state.branchGeo = action.payload
    },
    setBranchDataName(state, action) {
      state.branchDataName = action.payload
    },
    setReady(state, action) {
      state.geoDataReady = action.payload
    }
  }
})

export const {
  initialFetchSuccess,
  setBranchGeo,
  setBranchDataName,
  setReady
} = geoDataSlice.actions

export const fetchBranchData = file => async dispatch => {
  try {
    const res = await axios(`./static/${file}`)
    dispatch(setBranchGeo(addFeature(res.data)))
    dispatch(setBranchDataName(file))
  } catch (error) {
    dispatch(setReady(false))
  }
}

export const fetchGeoData = () => async dispatch => {
  try {
    const res = await axios.all([
      axios.get('./static/europe.geojson'),
      axios.get('./static/VIZ-DEC_20181121_0630_FO3_UC8_PFC.json'),
      axios.get('./static/branchCenters.geojson')
    ])
    dispatch(
      initialFetchSuccess({
        euMap: res[0].data,
        branchGeo: addFeature(res[1].data),
        branchCenters: res[2].data
      })
    )
  } catch (error) {
    dispatch(setReady(false))
  }
}

export default geoDataSlice.reducer
