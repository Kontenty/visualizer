import { geomEach, point } from '@turf/turf'

export function roundTo(num, n = 2) {
  return Math.round(num * 10 ** n) / 10 ** n
}

export function sumArraysAcross(...arrays) {
  const n = arrays.reduce((max, xs) => Math.max(max, xs.length), 0)
  const result = Array.from({ length: n })
  console.log(arrays)
  return result.map((_, i) => arrays.map(xs => xs[i] || 0).reduce((sum, x) => sum + x, 0))
}

export function sumArrays(arrays) {
  return arrays.map(arr => arr.reduce((sum, current) => roundTo(sum + current)))
}

export function equalArrays(arr1, arr2) {
  if (!arr1 || !arr2) return
  if (arr1.length !== arr2.length) return false

  return arr1.every((el, index) => el === arr2[index])
}

export function addFeature(geoData) {
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

export const calcMin = arr => {
  return Math.min(...arr)
}
export const calcMax = arr => {
  return Math.max(...arr)
}

export const sort = (arr, dir = 'asc') => {
  if (dir === 'asc') {
    return arr.sort((a, b) => a - b)
  } else if (dir === 'desc') {
    return arr.sort((a, b) => b - a)
  }
}

export const quantile = (arr, q) => {
  const sorted = sort(arr)
  const pos = (sorted.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base])
  } else {
    return sorted[base]
  }
}
