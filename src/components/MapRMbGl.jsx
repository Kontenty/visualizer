import React, { Component } from 'react'
import ReactMapboxGl from 'react-mapbox-gl'
import axios from 'axios'

import GeoJsonMap from './GeoJsonMap'

const MapBox = ReactMapboxGl({
  minZoom: 3,
  maxZoom: 15,
  accessToken:
    'pk.eyJ1Ijoia29udGVudHkiLCJhIjoiY2s1NnZlaHBhMDdyZDNmcGd2MGZiMXF6aCJ9.2VrHuqCEQVaI8dJqicq1Ug'
})

const paint = {
  'fill-color': 'rgba(200, 100, 240, 0.4)',
  'fill-outline-color': 'rgba(200, 100, 240, 1)'
}

class MapRGL extends Component {
  constructor() {
    super()
    this.state = {
      center: [21.0206279, 52.1802912],
      zoom: [5],
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
          {/* <Source id='source_europe' geoJsonSource={geojsonData} /> */}
          {showGeoJson && (
            // <Layer type='fill' id='layer_eu_geo' sourceId='source_europe' paint={paint} />
            <GeoJsonMap data={geojsonData} paint={paint} />
          )}
        </MapBox>
      </>
    )
  }
}

export default MapRGL
