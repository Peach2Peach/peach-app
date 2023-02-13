export const floor = (num: number, digits = 0) => {
  const exp = 10 ** digits
  const result = Math.floor(num * exp) / exp
  return digits > 0 ? result : Math.round(result)
}
