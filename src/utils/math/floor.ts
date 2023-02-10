export const floor = (num: number, digits = 0) => {
  const exp = 10 ** digits
  return Math.floor(num * exp) / exp
}
