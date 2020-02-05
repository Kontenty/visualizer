import React from 'react'
import PropTypes from 'prop-types'
// import * as MapboxGL from 'mapbox-gl'
import { GeoJSONLayer } from 'react-mapbox-gl'

const fillPaint = {
  'fill-color': '#ff8484',
  'fill-opacity': 0.3
}
const linePaint = {
  'line-color': '#333333'
}
const GeoJsonMap = ({ data }) => {
  /* const onClick = e => {
    console.log(e)
    console.log(e.target)
  } */

  return (
    <GeoJSONLayer
      data={data}
      fillPaint={fillPaint}
      linePaint={linePaint}
      // fillOnClick={onClick}
    />
  )
}

export default GeoJsonMap

GeoJsonMap.propTypes = {
  data: PropTypes.object.isRequired
}
