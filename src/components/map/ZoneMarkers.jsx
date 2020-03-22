import React from 'react'
import { Marker } from 'react-map-gl'
import styled from 'styled-components'
import { hsl } from 'd3-color'

import { roundTo } from 'helpers'

const StyledMarker = styled(Marker)`
  font-size: ${pr => roundTo((pr.fontBase + 2) * 2)}px;
  color: ${pr => pr.fontColor};
  text-align: center;
  line-height: 1;
`

const ZoneMarkers = ({ data, zoom, colors }) => {
  const zoneColors = colors.slice(2, -3)
  return data
    ? data.map((netPos, index) => {
        const color = zoneColors[zoneColors.indexOf(netPos.name) + 1]
        return (
          // eslint-disable-next-line react/jsx-indent
          <StyledMarker
            key={`marker-${index}`}
            longitude={netPos.coords[0]}
            latitude={netPos.coords[1]}
            offsetLeft={-7}
            offsetTop={-7}
            fontBase={zoom}
            fontColor={hsl(color).l < 0.49 ? 'white' : 'black'}
          >
            {netPos.name}
            <br />
            {roundTo(netPos.value)}
          </StyledMarker>
        )
      })
    : null
}

export default ZoneMarkers
