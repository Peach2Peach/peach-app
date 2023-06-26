import { enforceNumberFormat } from './enforceNumberFormat'

export const enforceDecimalsFormat = (value: string, decimals: number) => {
  const formatted = enforceNumberFormat(value)
  if (value.toString().includes('.')) {
    const [integer, decimal] = value.toString().split('.')
    if (decimals === 0) return integer
    return `${integer}.${decimal.slice(0, decimals)}`
  }

  return formatted
}
