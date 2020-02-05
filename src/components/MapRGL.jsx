import React, { Component } from 'react'
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl'
import axios from 'axios'

import GeoJsonMap from './GeoJsonMap'

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
      zoom: [11],
      geojsonData: null,
      showGeoJson: false
    }
  }

  componentDidMount() {
    ;(async () => {
      try {
        const res = await axios.get('./static/europe.geo.json')
        this.setState({ geojsonData: res.data, showGeoJson: true })
      } catch (error) {
        console.log(error)
      }
    })()
  }

  render() {
    const { center, zoom, showGeoJson, geojsonData } = this.state
    return (
      <>
        <MapBox
          center={center}
          zoom={zoom}
          style='mapbox://styles/mapbox/streets-v9'
          containerStyle={{ flexGrow: 1 }}
          onClick={e => console.log(e)}
        >
          <Layer
            type='symbol'
            id='marker'
            layout={{ 'icon-image': 'marker-15' }}
            onClick={e => console.log(e)}
          >
            <Feature coordinates={center} />
          </Layer>
          {showGeoJson && <GeoJsonMap data={geojsonData} />}
        </MapBox>
      </>
    )
  }
}

export default Map
