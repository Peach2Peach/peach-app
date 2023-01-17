export const round = (num: number, digits = 0) => {
  const exp = 10 ** digits
  return Math.round(num * exp) / exp
}
