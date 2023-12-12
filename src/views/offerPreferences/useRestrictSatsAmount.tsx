import { useCallback, useMemo } from 'react'
import { useMarketPrices } from '../../hooks'
import { getTradingAmountLimits } from '../../utils/market/getTradingAmountLimits'

export const useRestrictSatsAmount = (type: 'sell' | 'buy') => {
  const { data } = useMarketPrices()
  const [minAmount, maxAmount] = useMemo(() => getTradingAmountLimits(data?.CHF || 0, type), [data?.CHF, type])

  const restrictAmount = useCallback(
    (amount: number) => {
      if (amount < minAmount) {
        return minAmount
      } else if (amount > maxAmount) {
        return maxAmount
      }
      return amount
    },
    [minAmount, maxAmount],
  )
  return restrictAmount
}
