import React, { Component } from 'react'
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl'

const MapBox = ReactMapboxGl({
  minZoom: 3,
  maxZoom: 15,
  accessToken:
    'pk.eyJ1Ijoia29udGVudHkiLCJhIjoiY2s1NnZlaHBhMDdyZDNmcGd2MGZiMXF6aCJ9.2VrHuqCEQVaI8dJqicq1Ug'
})
class Map extends Component {
  constructor() {
    super()
    this.state = {
      center: [21.0206279, 52.1802912],
      zoom: [11]
    }
  }

  render() {
    const { center, zoom } = this.state
    return (
      <div>
        <MapBox
          center={center}
          zoom={zoom}
          style='mapbox://styles/mapbox/streets-v9'
          containerStyle={{
            height: '600px',
            width: '100vw'
          }}
        >
          <Layer type='symbol' id='marker' layout={{ 'icon-image': 'marker-15' }}>
            <Feature coordinates={center} />
          </Layer>
        </MapBox>
      </div>
    )
  }
}

export default Map
