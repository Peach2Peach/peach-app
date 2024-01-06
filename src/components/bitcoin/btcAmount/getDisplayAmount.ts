import { SATSINBTC } from '../../../constants'
import { groupChars } from '../../../utils/string/groupChars'

const GROUP_BY = 3
export function getDisplayAmount (amount: number) {
  if (amount === 0) return ['0.00 000 00', '0']

  const btc = amount / SATSINBTC

  const [whole, decimal] = btc
    .toFixed(SATSINBTC.toString().length - 1)
    .split('.')
    .map((str) => groupChars(str, GROUP_BY))

  const displayAmount = `${whole}.${decimal}`
  const firstValueIndex = displayAmount.search(/[^0. ]/u)
  const leadingZeros = displayAmount.substring(0, firstValueIndex)
  const restOfNumber = displayAmount.substring(firstValueIndex)

  if (leadingZeros.endsWith(' ')) {
    return [leadingZeros.slice(0, -1), ` ${restOfNumber}`]
  }

  return [leadingZeros, restOfNumber]
}
