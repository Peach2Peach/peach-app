import { SATSINBTC } from '../../constants'
import { round } from '../math'

const rangeInCHF = [20, 800]

export const getTradingAmountLimits = (price: number) =>
  rangeInCHF.map((chf) => round(Math.floor((chf / price) * SATSINBTC), -4))
