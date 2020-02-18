import React, { Component } from 'react'
import MapGL, { Source, Layer, Popup } from 'react-map-gl'
import axios from 'axios'
import _ from 'lodash'
import { interpolateOranges } from 'd3-scale-chromatic'
import { scaleSequential } from 'd3-scale'
import { geomEach } from '@turf/meta'
import { point } from '@turf/helpers'

import Table from './Table'
// import arrow from '../assets/arrow.svg'
import { sumArrays } from '../helpers'

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

const countriesLineLayer = {
  id: 'lines',
  type: 'line',
  paint: {
    'line-color': '#888',
    'line-dasharray': [3, 3],
    'line-width': 2
  }
}
const branchLineLayer = {
  id: 'branchLine',
  type: 'line',
  filter: ['==', '$type', 'LineString'],
  paint: {
    'line-color': '#DC143C',
    'line-width': 2
  }
}
const branchCircleLayer = {
  id: 'branchCircle',
  type: 'circle',
  filter: ['==', '$type', 'Point'],
  paint: {
    'circle-color': 'red',
    'circle-radius': {
      base: 1.5,
      stops: [
        [1, 2],
        [6, 3],
        [10, 6]
      ]
    }
  }
}
const branchArrowLayer = {
  id: 'branchArrow',
  type: 'symbol',
  layout: {
    'symbol-placement': 'line-center',
    'symbol-spacing': 1,
    'icon-allow-overlap': true,
    // 'icon-ignore-placement': true,
    'icon-image': 'rocket-15',
    'icon-rotate': 45,
    'icon-size': {
      base: 1,
      stops: [
        [4, 0.5],
        [6, 1],
        [10, 1.5]
      ]
    },
    visibility: 'visible'
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
      countriesPaint: {
        'fill-color': '#65bbef',
        // 'fill-outline-color': '#333',
        'fill-opacity': 0.5
      },
      euMapGeojson: null,
      branchesGeoData: null,
      showGeoJson: false,
      popupInfo: null
    }
  }

  addFeature = geoData => {
    const pointFeatures = []
    geomEach(geoData, (currentGeometry, featureIndex, featureProperties) => {
      pointFeatures.push(
        point(currentGeometry.coordinates[0], {
          node: featureProperties['CB Node 1']
        })
      )
      pointFeatures.push(
        point(currentGeometry.coordinates[1], {
          node: featureProperties['CB Node 2']
        })
      )
    })
    return { ...geoData, features: [...geoData.features, ...pointFeatures] }
  }

  componentDidMount() {
    ;(async () => {
      try {
        const res = await axios.all([
          axios.get('./static/europe.geojson'),
          axios.get('./static/20181130_1030.json')
        ])
        this.setState({
          euMapGeojson: res[0].data,
          branchesGeoData: this.addFeature(res[1].data),
          showGeoJson: true
        })
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
      const countriesVals = rowData.map(el => el[1])
      const countriesTotals = sumArrays(countriesVals)
      const totalFlow = countriesTotals.reduce((sum, num) => sum + num)
      const popupInfo = {
        lngLat: event.lngLat,
        properties,
        columns,
        rowData,
        countriesTotals,
        totalFlow
      }
      const colorScale = scaleSequential(
        [_.min(countriesTotals), _.max(countriesTotals)],
        t => interpolateOranges(t)
      )
      const fillExpression = ['match', ['get', 'iso_a2']]
      countriesTotals.forEach((val, i) => {
        console.log(val, colorScale(val))
        return fillExpression.push(rowData[i][0], colorScale(val))
      })
      fillExpression.push('rgb(255,255,255)')
      console.log('fillExpression', fillExpression)

      this.setState({ popupInfo })
      this.setState({
        countriesPaint: { 'fill-opacity': 0.9, 'fill-color': fillExpression }
      })
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
    const { viewport, euMapGeojson, branchesGeoData, showGeoJson } = this.state
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
          interactiveLayerIds={['branchLine']}
        >
          {showGeoJson && (
            <>
              <Source type='geojson' data={euMapGeojson}>
                <Layer
                  id='data'
                  type='fill'
                  paint={this.state.countriesPaint}
                  beforeId='waterway-label'
                />
                <Layer {...countriesLineLayer} />
              </Source>
              <Source type='geojson' data={branchesGeoData}>
                <Layer {...branchLineLayer} />
                <Layer {...branchCircleLayer} />
                <Layer {...branchArrowLayer} />
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
