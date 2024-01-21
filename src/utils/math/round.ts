const BASE = 10
export const round = (num: number, digits = 0) => {
  const exp = BASE ** digits
  const result = Math.round(num * exp) / exp
  return digits > 0 ? result : Math.round(result)
}
