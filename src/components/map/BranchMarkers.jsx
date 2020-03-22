import React from 'react'
import { useSelector } from 'react-redux'
import { Marker } from 'react-map-gl'
import styled from 'styled-components'
import { bearing, point } from '@turf/turf'
import { ReactComponent as ArrowSvg } from 'assets/arrow.svg'

const StyledMarker = styled(Marker)`
  svg {
    height: 20px;
    transform: rotate(${props => props.angle}deg);
  }
  path {
    fill: blue;
  }
`

const BranchMarkers = ({ zoom }) => {
  const branchCenters = useSelector(({ geoData }) => geoData.branchCenters)
  const branches = useSelector(({ geoData }) => geoData.branchGeo)

  const data = branches.features
    .filter(ft => ft.geometry.type === 'LineString')
    .map(ft => {
      const id = `${ft.properties['CB Node 1']}->${ft.properties['CB Node 2']}`
      const centerFt = branchCenters.features.find(o => o.properties.id === id)
      if (centerFt) {
        const { geometry, properties } = centerFt
        const point1 = point(ft.geometry.coordinates[0])
        const point2 = point(ft.geometry.coordinates[1])
        return {
          coords: geometry.coordinates,
          angle: bearing(point1, point2),
          id: properties.id
        }
      }
    })

  console.log(data)
  console.log(branches)
  return data.map(dt => (
    <StyledMarker
      key={dt.id}
      longitude={dt.coords[0]}
      latitude={dt.coords[1]}
      angle={dt.angle}
    >
      <ArrowSvg />
    </StyledMarker>
  ))
}

export default React.memo(BranchMarkers)
