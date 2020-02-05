import React, { Component } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import axios from 'axios'

const accessToken =
  'pk.eyJ1Ijoia29udGVudHkiLCJhIjoiY2s1NnZlaHBhMDdyZDNmcGd2MGZiMXF6aCJ9.2VrHuqCEQVaI8dJqicq1Ug'
mapboxgl.accessToken = accessToken

class Map extends Component {
  constructor() {
    super()
    this.state = {
      // center: [21.0206279, 52.1802912],
      center: [-99.9, 41.5],
      zoom: 4,
      geojsonData: null,
      showGeoJson: false,
      styleName: 'streets-v9'
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

    this.map = new mapboxgl.Map({
      container: this.mapContainer, // html element id in render
      // style: `mapbox://styles/${this.state.styleName}`,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: this.state.center, // note: lon comes before lat
      zoom: this.state.zoom
    })

    this.map.on('load', () => {
      // Add a source for the state polygons.
      this.map.addSource('states', {
        type: 'geojson',
        data:
          'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces_shp.geojson'
      })

      // Add a layer showing the state polygons.
      this.map.addLayer({
        id: 'states-layer',
        type: 'fill',
        source: 'states',
        paint: {
          'fill-color': 'rgba(200, 100, 240, 0.4)',
          'fill-outline-color': 'rgba(200, 100, 240, 1)'
        }
      })

      // When a click event occurs on a feature in the states layer, open a popup at the
      // location of the click, with description HTML from its properties.
      this.map.on('click', 'states-layer', e => {
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(e.features[0].properties.name)
          .addTo(this.map)
      })

      // Change the cursor to a pointer when the mouse is over the states layer.
      this.map.on('mouseenter', 'states-layer', () => {
        this.map.getCanvas().style.cursor = 'pointer'
      })

      // Change it back to a pointer when it leaves.
      this.map.on('mouseleave', 'states-layer', () => {
        this.map.getCanvas().style.cursor = ''
      })
    })
  }

  render() {
    return <div ref={el => (this.mapContainer = el)} style={{ flexGrow: 1 }} />
  }
}

export default Map
