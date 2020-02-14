import React, { Component } from 'react'
import MapGL, { Source, Layer, Popup } from 'react-map-gl'
import axios from 'axios'

import Table from './Table'
import branchesGeoData from '../assets/20181130_1030.json'

/* const paint = {
  'fill-color': 'rgba(200, 100, 240, 0.4)',
  'fill-outline-color': 'rgba(200, 100, 240, 1)'
} */

/* [0, '#3288bd'],
  [1, '#66c2a5'],
  [2, '#abdda4'],
  [3, '#e6f598'],
  [4, '#ffffbf'],
  [5, '#fee08b'],
  [6, '#fdae61'],
  [7, '#f46d43'],
  [8, '#d53e4f'] */

const countriesFillLayer = {
  id: 'data',
  type: 'fill',
  paint: {
    'fill-color': '#3288bd',
    // 'fill-outline-color': '#333',
    'fill-opacity': 0.1
  }
}
const countriesLineLayer = {
  id: 'lines',
  type: 'line',
  paint: {
    'line-color': '#888',
    'line-dasharray': [3],
    'line-width': 2
  }
}
const branchLineLayer = {
  id: 'branches',
  type: 'line',
  paint: {
    'line-color': '#DC143C',
    'line-width': 2
  }
}

class MapRGL extends Component {
  constructor() {
    super()
    this.state = {
      center: [21.0206279, 52.1802912],
      zoom: [5],
      viewport: {
        longitude: 21.0206279,
        latitude: 52.1802912,
        zoom: 3,
        bearing: 0,
        pitch: 0
      },
      geojsonData: null,
      showGeoJson: false,
      popupInfo: null
    }
  }

  componentDidMount() {
    ;(async () => {
      try {
        const res = await axios.get('./static/europe.geojson')
        this.setState({ geojsonData: res.data, showGeoJson: true })
      } catch (error) {
        console.log(error)
      }
    })()
  }

  onHover = event => {
    if (event.features[0]) console.log(event.features[0])
  }

  onClick = event => {
    const clicked = event.features[0]

    if (clicked) {
      const { properties } = clicked
      const flows = JSON.parse(properties.flows)
      const zones = JSON.parse(properties.zones)
      const columns = ['Zone', ...Object.keys(flows)]
      const flowValues = Object.values(flows)
      const rowData = zones.map((zone, i) => [zone, this.getValue(flowValues, i)])
      const popupInfo = { lngLat: event.lngLat, properties, columns, rowData }

      this.setState({ popupInfo })
    }
  }

  getValue(array, i) {
    return array.map(arr => arr[i])
  }

  renderPopup() {
    const { popupInfo } = this.state
    if (popupInfo) {
      const { properties, columns, rowData } = popupInfo

      return (
        <Popup
          longitude={popupInfo.lngLat[0]}
          latitude={popupInfo.lngLat[1]}
          onClose={() => this.setState({ popupInfo: null })}
        >
          <div>{properties['CB Type']}</div>
          <Table columns={columns} rows={rowData} />
        </Popup>
      )
    }
    return null
  }

  render() {
    const { viewport, geojsonData, showGeoJson } = this.state
    return (
      <>
        <MapGL
          {...viewport}
          width='100%'
          height='100%'
          mapStyle='mapbox://styles/mapbox/light-v9'
          clickRadius={3}
          onViewportChange={viewport => this.setState({ viewport })}
          mapboxApiAccessToken='pk.eyJ1Ijoia29udGVudHkiLCJhIjoiY2s1NnZlaHBhMDdyZDNmcGd2MGZiMXF6aCJ9.2VrHuqCEQVaI8dJqicq1Ug'
          // onHover={this.onHover}
          onClick={this.onClick}
          interactiveLayerIds={['branches']}
        >
          {showGeoJson && (
            <>
              <Source type='geojson' data={geojsonData}>
                <Layer {...countriesFillLayer} />
                <Layer {...countriesLineLayer} />
              </Source>
              <Source type='geojson' data={branchesGeoData}>
                <Layer {...branchLineLayer} />
              </Source>
              {this.renderPopup()}
            </>
          )}
        </MapGL>
      </>
    )
  }
}

export default MapRGL
