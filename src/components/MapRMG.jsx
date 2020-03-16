import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import MapGL, { Source, Layer, Popup } from 'react-map-gl'
// import axios from 'axios'
import _ from 'lodash'
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'
import { interpolateOranges } from 'd3-scale-chromatic'
import { scaleSequential } from 'd3-scale'
// import { geomEach } from '@turf/meta'
// import { point } from '@turf/helpers'
import 'mapbox-gl/dist/mapbox-gl.css'

// import Table from './Table'
import Table from './TableSortable'
import Markers from './Markers'
import RightBar from './RightBar'
import { fetchGeoData } from '../slices/geoDataSlice'

// import arrow from '../assets/arrow.svg'
import { sumArrays, equalArrays, roundTo } from '../helpers'
import { toggleVisibility, showTable, setBranchName } from '../slices/branchDetailSlice'
import centers from '../assets/zoneCenters.json'

const countriesLineLayer = {
  id: 'lines',
  type: 'line',
  paint: {
    'line-color': '#888',
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
        'fill-color': '#ffffe6',
        // 'fill-outline-color': '#333',
        'fill-opacity': 0.4
      },
      popupInfo: null,
      showPopup: false,
      netPositions: null
    }
  }

  componentDidMount() {
    this.props.fetchGeoData()
  }

  componentDidUpdate(prevProps) {
    if (
      this.state.popupInfo &&
      !equalArrays(this.props.selectedCategories, prevProps.selectedCategories)
    ) {
      this.setZoneColor()
    }
  }

  setZoneColor = () => {
    const { selectedCategories } = this.props
    if (selectedCategories.length === 0) {
      this.setState({
        countriesPaint: {
          'fill-color': '#ffffe6',
          'fill-opacity': 0.4
        },
        netPositions: null
      })
      return
    }
    const { rowData, columns } = this.state.popupInfo
    const categoriesList = columns.slice(1)
    const countOrNot = categoriesList.map(el => !!selectedCategories.includes(el))

    if (selectedCategories.length > 0) {
      const sumPerCountry = rowData.map(country =>
        country[1].filter((_, i) => countOrNot[i]).reduce((sum, current) => sum + current)
      )
      const colorScale = scaleSequential(
        [_.min(sumPerCountry), _.max(sumPerCountry)],
        t => interpolateOranges(t)
      )

      const netPositions = []
      const fillExpression = ['match', ['get', 'iso_a2']]
      sumPerCountry.forEach((value, i) => {
        const name = rowData[i][0]
        const feature = centers.find(el => el.name === name)
        if (feature)
          netPositions.push({ name, value, coords: feature.representative_point })
        return fillExpression.push(rowData[i][0], colorScale(value))
      })
      fillExpression.push('rgb(255,255,255)')

      this.setState({
        countriesPaint: { 'fill-opacity': 0.95, 'fill-color': fillExpression },
        netPositions
      })
    }
  }

  onHover = event => {
    if (event.features[0]) console.log(event.features[0])
  }

  onClick = event => {
    const clicked = event.features[0]

    if (clicked) {
      // this.props.toggleVisibility()
      const { properties } = clicked
      const flows = JSON.parse(properties.flows)
      const zoneNames = JSON.parse(properties.zones)
      const filteredCat = Object.keys(flows).filter(key => key !== 'Exchange flows [MW]')
      const flowValues = filteredCat.map(key => flows[key])
      const rowData = zoneNames.map((zone, i) => [zone, this.getValue(flowValues, i)])
      const countriesVals = rowData.map(el => el[1])
      // console.log(countriesVals)
      const countriesTotals = sumArrays(countriesVals)

      const totalFlow = roundTo(countriesTotals.reduce((sum, num) => sum + num))

      const columns = ['Zone', ...filteredCat, 'Zone total']
      const rowsForSort = rowData.map((row, index) => ({
        name: row[0],
        internal_flow: row[1][0],
        loop_flow: row[1][1],
        impex_flow: row[1][2],
        transit_flow: row[1][3],
        pst_flow: row[1][4],
        zone_total: countriesTotals[index]
      }))

      const headRow = [
        'Category total',
        ...countriesVals.reduce((sum, cur) => cur.map((el, i) => roundTo(sum[i] + el))),
        totalFlow
      ]

      // console.log(rowsForSort)
      // console.log(rowData)
      const popupInfo = {
        lngLat: event.lngLat,
        properties,
        columns,
        headRow,
        rowData,
        countriesTotals,
        totalFlow,
        rowsForSort
      }

      this.props.setBranchName(`${properties['CB Node 1']} - ${properties['CB Node 2']}`)
      this.setState({ popupInfo, showPopup: true })
    }
  }

  getValue(array, i) {
    return array.map(arr => arr[i])
  }

  renderPopup() {
    const { popupInfo, showPopup } = this.state
    if (showPopup) {
      const { properties } = popupInfo

      return (
        <Popup
          longitude={popupInfo.lngLat[0]}
          latitude={popupInfo.lngLat[1]}
          onClose={() => {
            this.setState({ showPopup: false })
            // this.props.toggleVisibility()
          }}
        >
          <div>
            type: {properties['CB Type']} <br />
            {properties['CB Node 1']} - {properties['CB Node 2']}
          </div>
        </Popup>
      )
    }
    return null
  }

  render() {
    const { viewport, popupInfo } = this.state
    const { euMap, branchGeo, geoDataReady } = this.props

    return (
      <>
        <MapGL
          {...viewport}
          width='100%'
          height='100%'
          mapStyle={`mapbox://styles/mapbox/${this.props.mapboxStyle}`}
          clickRadius={3}
          onViewportChange={viewport => this.setState({ viewport })}
          mapboxApiAccessToken='pk.eyJ1Ijoia29udGVudHkiLCJhIjoiY2s1NnZlaHBhMDdyZDNmcGd2MGZiMXF6aCJ9.2VrHuqCEQVaI8dJqicq1Ug'
          // onHover={this.onHover}
          onClick={this.onClick}
          // onLoad={e => console.log(e)}
          interactiveLayerIds={['branchLine']}
        >
          {geoDataReady && (
            <>
              <Source type='geojson' data={euMap}>
                <Layer id='data' type='fill' paint={this.state.countriesPaint} />
                <Layer {...countriesLineLayer} />
              </Source>
              <Source type='geojson' data={branchGeo}>
                <Layer {...branchLineLayer} />
                <Layer {...branchCircleLayer} />
                <Layer {...branchArrowLayer} />
              </Source>
              <Markers data={this.state.netPositions} />
              {this.renderPopup()}
            </>
          )}
        </MapGL>
        <RightBar isOpen={this.props.isTableVisible} close={() => this.props.showTable()}>
          {popupInfo && (
            <>
              <div style={{ margin: '3px 2px' }}>
                <Chip
                  avatar={<Avatar>B</Avatar>}
                  label={`branch - ${this.props.branchName}`}
                  color='primary'
                  // deleteIcon={<DoneIcon />}
                  variant='outlined'
                  style={{ marginRight: '5px' }}
                />
                <Chip
                  avatar={<Avatar>T</Avatar>}
                  label={`total flow - ${popupInfo.totalFlow}`}
                  color='primary'
                  // deleteIcon={<DoneIcon />}
                  variant='outlined'
                />
              </div>
              <Table
                columns={popupInfo.columns}
                rows={popupInfo.rowsForSort}
                headRow={popupInfo.headRow}
              />
            </>
          )}
        </RightBar>
      </>
    )
  }
}
function mapStateToProps({ mapStyle, branchDetailSlice, geoData }) {
  return {
    mapboxStyle: mapStyle.mapboxStyle,
    isTableVisible: branchDetailSlice.isTableVisible,
    selectedCategories: branchDetailSlice.selectedCategories,
    branchName: branchDetailSlice.branchName,
    euMap: geoData.euMap,
    branchGeo: geoData.branchGeo,
    geoDataReady: geoData.geoDataReady
  }
}
export default connect(mapStateToProps, {
  toggleVisibility,
  showTable,
  setBranchName,
  fetchGeoData
})(MapRGL)

MapRGL.propTypes = {
  mapboxStyle: PropTypes.string.isRequired,
  branchName: PropTypes.string.isRequired,
  isTableVisible: PropTypes.bool.isRequired,
  selectedCategories: PropTypes.array.isRequired,
  toggleVisibility: PropTypes.func.isRequired,
  setBranchName: PropTypes.func.isRequired,
  showTable: PropTypes.func.isRequired,
  euMap: PropTypes.object.isRequired,
  branchGe: PropTypes.object.isRequired,
  geoDataReady: PropTypes.bool.isRequired
}
