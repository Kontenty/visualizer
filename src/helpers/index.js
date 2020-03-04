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
