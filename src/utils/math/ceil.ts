export const ceil = (num: number, digits = 0) => {
  const exp = 10 ** digits
  const result = Math.ceil(num * exp) / exp
  return digits > 0 ? result : Math.round(result)
}
