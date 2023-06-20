export const enforceDecimalsFormat = (value: string | number, decimals: number) => {
  const formatted = value.toString()
  if (value.toString().includes('.')) {
    const [integer, decimal] = value.toString().split('.')
    if (decimals === 0) return integer
    return `${integer}.${decimal.slice(0, decimals)}`
  }

  return formatted
}
