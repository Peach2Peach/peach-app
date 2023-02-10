export const floor = (num: number, digits = 0) => {
  const exp = 10 ** digits
  const result = Math.round(num * exp) / exp
  return digits > 0 ? result : Math.round(result)
}
