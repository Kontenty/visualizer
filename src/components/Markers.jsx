import React from 'react'
import { Marker } from 'react-map-gl'

import { roundTo } from '../helpers'

const Markers = ({ data }) => {
  return data
    ? data.map((netPos, index) => (
        // eslint-disable-next-line react/jsx-indent
        <Marker
          key={`marker-${index}`}
          longitude={netPos.coords[0]}
          latitude={netPos.coords[1]}
        >
          {roundTo(netPos.value)}
        </Marker>
      ))
    : null
}

export default Markers
