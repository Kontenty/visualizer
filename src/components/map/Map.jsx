import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import MapGL, { Source, Layer } from 'react-map-gl'
import {
  interpolateOranges,
  interpolateOrRd,
  interpolateBlues,
  interpolatePuOr,
  interpolateRdBu,
  interpolateRdYlBu
} from 'd3-scale-chromatic'
// import { scaleSequential, scaleDiverging } from 'd3-scale'
import 'mapbox-gl/dist/mapbox-gl.css'
import * as d3 from 'd3'

import BranchPopup from './BranchPopup'
import ZoneMarkers from './ZoneMarkers'
import MapRightPanel from './MapRightPanel'
// import LegendWidget from '../LegendWidget'
import {
  countriesLineLayer,
  branchLineLayer,
  branchCircleLayer,
  branchArrowLayer
} from './layerConfig'

import { sumArrays, equalArrays, roundTo, calcMin, calcMax } from 'helpers'
import { fetchGeoData } from 'slices/geoDataSlice'
import { setColorScaleType } from 'slices/mapLookSlice'
import {
  showTable,
  setBranchName,
  setCOName,
  setSumPerZone,
  setMinMax
} from 'slices/branchDetailSlice'
import centers from 'assets/zoneCenters.json'

const colorsDict = {
  seq: {
    orange: interpolateOranges,
    red: interpolateOrRd,
    blue: interpolateBlues
  },
  div: {
    orange: interpolatePuOr,
    red: interpolateRdBu,
    blue: interpolateRdYlBu
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
        maxZoom: 8,
        minZoom: 1.5,
        bearing: 0,
        pitch: 0
      },
      countriesPaint: {
        'fill-color': '#f5f5f5',
        // 'fill-outline-color': '#333',
        'fill-opacity': 0.1
      },
      popupInfo: null,
      showPopup: false,
      netPositions: null
    }
    this.defaultCountriesPaint = {
      'fill-color': '#ffffe6',
      'fill-opacity': 0.3
    }
  }

  componentDidMount() {
    this.props.fetchGeoData()
  }

  componentDidUpdate(prevProps) {
    if (
      (this.state.popupInfo &&
        !equalArrays(this.props.selectedCategories, prevProps.selectedCategories)) ||
      this.props.branchName !== prevProps.branchName ||
      this.props.colorScheme !== prevProps.colorScheme
    ) {
      this.setZoneColor()
    }
  }

  setZoneColor = () => {
    console.log('set color func')
    const { selectedCategories } = this.props
    if (selectedCategories.length === 0) {
      this.setState({
        countriesPaint: this.defaultCountriesPaint,
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
      const min = calcMin(sumPerCountry)
      const max = calcMax(sumPerCountry)
      const normalizedMinMax =
        (min < 0 && max < 0) || (min > 0 && max > 0)
          ? [min, max]
          : max > Math.abs(min)
          ? [-max, 0, max]
          : [min, 0, -min]
      /* const colorScale =
        min < 0 && max > 0
          ? scaleDiverging(normalizedMinMax, t =>
              colorsDict.div[this.props.colorScheme](1 - t)
            )
          : scaleSequential(normalizedMinMax, t =>
              colorsDict.seq[this.props.colorScheme](t)
            ) */
      const colors = {
        blue_red: [
          '#37b8e9',
          '#8bceea',
          '#c7e7ea',
          '#fdfbe1',
          '#fcceb9',
          '#f79c86',
          '#f06950'
        ],
        pur_orange: ['#e66101', '#fdb863', '#f7f7f7', '#b2abd2', '#5e3c99']
      }
      const colorScale =
        max <= 0.99 || min >= -0.99
          ? d3.scaleQuantile(sumPerCountry, ['#e66101', '#fdb863', '#f7f7f7'].reverse())
          : d3.scaleThreshold(
              [min * 0.5, min * 0.1, max * 0.1, max * 0.5],
              colors.pur_orange.reverse()
            )

      const netPositions = []
      const fillExpression = ['match', ['get', 'iso_a2']]
      sumPerCountry.forEach((value, i) => {
        const name = rowData[i][0]
        const feature = centers.find(el => el.name === name)
        if (feature)
          netPositions.push({ name, value, coords: feature.representative_point })
        fillExpression.push(rowData[i][0], colorScale(value))
      })
      fillExpression.push('rgb(150,150,150)')

      this.setState({
        countriesPaint: { 'fill-opacity': 0.97, 'fill-color': fillExpression },
        netPositions
      })
      this.props.setColorScaleType(
        max <= 0.99 || min >= -0.99 ? 'sequential' : 'diverging'
      )
      this.props.setSumPerZone(sumPerCountry)
      this.props.setMinMax(normalizedMinMax)
    }
  }

  onHover = event => {
    if (event.features[0]) console.log(event.features[0])
  }

  onClick = event => {
    const clicked = event.features[0]

    if (clicked) {
      const { properties } = clicked
      const flows = JSON.parse(properties.flows)
      const zoneNames = JSON.parse(properties.zones)
      const categories = Object.keys(flows)
      const flowValues = categories.map(key => flows[key])
      // console.log(flowValues)
      const rowData = zoneNames.map((zone, i) => [zone, this.getValue(flowValues, i)])
      const countriesVals = rowData.map(el => el[1])
      // console.log(countriesVals)
      const countriesTotals = sumArrays(countriesVals)

      const totalFlow = roundTo(countriesTotals.reduce((sum, num) => sum + num))

      const columns = ['Zone', ...categories, 'Zone total']
      const rowsForSort = rowData.map((row, index) => ({
        name: row[0],
        internal_flow: row[1][0],
        impex_flow: row[1][1],
        transit_flow: row[1][2],
        loop_flow: row[1][3],
        pst_flow: row[1][4],
        zone_total: countriesTotals[index]
      }))

      const headRow = [
        'Category total',
        ...countriesVals.reduce((sum, cur) => cur.map((el, i) => roundTo(sum[i] + el))),
        totalFlow
      ]

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

      this.props.setBranchName(`${properties.CB_FROM} - ${properties.CB_TO}`)
      this.props.setCOName(properties.CO_NAME)
      this.setState({ popupInfo, showPopup: true })
    }
  }

  getValue(array, i) {
    return array.map(arr => arr[i])
  }

  closePopup = () => {
    this.setState({ showPopup: false })
  }

  render() {
    const { viewport, popupInfo, showPopup, countriesPaint } = this.state
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
              {/* <Source
                id='ucte-vector'
                type='vector'
                url='https://maps.vis.services.idea.edu.pl/capabilities/zones.json'
              >
                <Layer
                  id='data'
                  source-layer='ucte_zones'
                  type='fill'
                  paint={this.state.countriesPaint}
                />
                <Layer {...countriesLineLayer} source-layer='ucte_zones' />
              </Source> */}
              <Source type='geojson' data={euMap}>
                <Layer id='data' type='fill' paint={this.state.countriesPaint} />
                <Layer {...countriesLineLayer} />
              </Source>
              <Source type='geojson' data={branchGeo}>
                <Layer {...branchLineLayer} />
                <Layer {...branchCircleLayer} />
                <Layer {...branchArrowLayer} />
              </Source>
              <ZoneMarkers
                data={this.state.netPositions}
                zoom={viewport.zoom}
                colors={countriesPaint['fill-color']}
              />
              {showPopup && (
                <BranchPopup popupInfo={popupInfo} onClose={this.closePopup} />
              )}
            </>
          )}
        </MapGL>
        <MapRightPanel
          isOpen={this.props.isTableVisible}
          close={() => this.props.showTable()}
          popupInfo={popupInfo}
        />
        {/* <LegendWidget colorPalette={colorsDict} /> */}
      </>
    )
  }
}
function mapStateToProps({ mapLook, branchDetail, geoData }) {
  return {
    mapboxStyle: mapLook.mapboxStyle,
    colorScheme: mapLook.colorScheme,
    isTableVisible: branchDetail.isTableVisible,
    selectedCategories: branchDetail.selectedCategories,
    branchName: branchDetail.branchName,
    euMap: geoData.euMap,
    branchGeo: geoData.branchGeo,
    branchCenters: geoData.branchCenters,
    geoDataReady: geoData.geoDataReady
  }
}
const mapDispatch = {
  showTable,
  setBranchName,
  setCOName,
  setColorScaleType,
  fetchGeoData,
  setMinMax,
  setSumPerZone
}
export default connect(mapStateToProps, mapDispatch)(MapRGL)

MapRGL.propTypes = {
  mapboxStyle: PropTypes.string.isRequired,
  colorScheme: PropTypes.string.isRequired,
  branchName: PropTypes.string.isRequired,
  isTableVisible: PropTypes.bool.isRequired,
  selectedCategories: PropTypes.array.isRequired,
  euMap: PropTypes.object,
  branchGeo: PropTypes.object,
  geoDataReady: PropTypes.bool.isRequired,
  setBranchName: PropTypes.func.isRequired,
  setCOName: PropTypes.func.isRequired,
  showTable: PropTypes.func.isRequired,
  fetchGeoData: PropTypes.func.isRequired,
  setColorScaleType: PropTypes.func.isRequired,
  setMinMax: PropTypes.func.isRequired,
  setSumPerZone: PropTypes.func.isRequired
}
