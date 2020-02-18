export function roundTo(num, n = 2) {
  return Math.round(num * 10 ** n) / 10 ** n
}

export function sumArraysAcross(...arrays) {
  const n = arrays.reduce((max, xs) => Math.max(max, xs.length), 0)
  const result = Array.from({ length: n })
  result.map((_, i) => console.log(i))
  return result.map((_, i) => arrays.map(xs => xs[i] || 0).reduce((sum, x) => sum + x, 0))
}

export function sumArrays(arrays) {
  return arrays.map(arr => arr.reduce((sum, current) => roundTo(sum + current)))
}
