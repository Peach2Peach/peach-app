import { SATSINBTC } from '../../constants'
import { ceil } from '../math/ceil'
import { floor } from '../math/floor'

const rangeSellInCHF = [10, 800]
const rangeBuyInCHF = [10, 1000]

export const getTradingAmountLimits = (btcPriceCHF: number, type: 'buy' | 'sell') => {
  const range = type === 'buy' ? rangeBuyInCHF : rangeSellInCHF
  return [ceil((range[0] / btcPriceCHF) * SATSINBTC, -4), floor((range[1] / btcPriceCHF) * SATSINBTC, -4)] as const
}
