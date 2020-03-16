import React from 'react'
import { Marker } from 'react-map-gl'
import styled from 'styled-components'

import { roundTo } from 'helpers'

const StyledMarker = styled(Marker)`
  font-size: ${props => roundTo((props.fontBase + 2) * 2)}px;
`

const Markers = ({ data, zoom }) => {
  return data
    ? data.map((netPos, index) => (
        // eslint-disable-next-line react/jsx-indent
        <StyledMarker
          key={`marker-${index}`}
          longitude={netPos.coords[0]}
          latitude={netPos.coords[1]}
          fontBase={zoom}
        >
          {netPos.name}
          <br />
          {roundTo(netPos.value)}
        </StyledMarker>
      ))
    : null
}

export default Markers
