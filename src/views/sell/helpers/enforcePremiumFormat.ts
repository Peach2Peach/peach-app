import { parsePremiumToString } from './parsePremiumToString'

export const enforcePremiumFormat = (value: string | number) => {
  let valueWithTwoDecimals = value.toString()
  if (value.toString().includes('.')) {
    const [integer, decimal] = value.toString().split('.')
    valueWithTwoDecimals = `${integer}.${decimal.slice(0, 2)}`
  }

  return parsePremiumToString(valueWithTwoDecimals)
}
