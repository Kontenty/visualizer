export const countriesLineLayer = {
  id: 'lines',
  type: 'line',
  paint: {
    'line-color': '#888',
    'line-width': 2
  }
}
export const branchLineLayer = {
  id: 'branchLine',
  type: 'line',
  filter: ['==', '$type', 'LineString'],
  paint: {
    'line-color': '#DC143C',
    'line-width': 2
  }
}
export const branchCircleLayer = {
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

export const branchArrowLayer = {
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
