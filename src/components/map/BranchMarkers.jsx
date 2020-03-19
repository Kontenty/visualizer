import React from 'react'
import { useSelector } from 'react-redux'
import { Marker } from 'react-map-gl'
// import { featureEach } from '@turf/turf'
import { find } from 'lodash'

const BranchMarkers = () => {
  const branchCenters = useSelector(({ geoData }) => geoData.branchCenters)
  const branches = useSelector(({ geoData }) => geoData.branchGeo)

  const data = branches.features
    .filter(ft => ft.geometry.type === 'LineString')
    .map(ft => {
      const id = `${ft.properties['CB Node 1']}->${ft.properties['CB Node 2']}`
      const centerFt = find(branchCenters.features, o => o.properties.id === id)
      if (centerFt) {
        const { geometry, properties } = centerFt
        return {
          coords: geometry.coordinates,
          angle: properties.angle,
          id: properties.id
        }
      }
    })

  console.log(data)
  console.log(branches)
  return data.map(dt => (
    <Marker key={dt.id} longitude={dt.coords[0]} latitude={dt.coords[1]}>
      {dt.id}
    </Marker>
  ))
}

export default React.memo(BranchMarkers)
