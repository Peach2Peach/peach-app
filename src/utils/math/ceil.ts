export const ceil = (num: number, digits = 0) => {
  const exp = 10 ** digits
  return Math.ceil(num * exp) / exp
}
