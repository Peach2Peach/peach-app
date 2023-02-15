import { SATSINBTC } from '../../constants'
import { ceil, floor } from '../math'

const rangeInCHF = [10, 800]

export const getTradingAmountLimits = (price: number) => [
  ceil((rangeInCHF[0] / price) * SATSINBTC, -4),
  floor((rangeInCHF[1] / price) * SATSINBTC, -4),
]
