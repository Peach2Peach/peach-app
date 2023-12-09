import { useCallback, useEffect } from 'react'
import { shallow } from 'zustand/shallow'
import { useConfigStore } from '../store/configStore/configStore'
import { useOfferPreferences } from '../store/offerPreferenes/useOfferPreferences'
import { getTradingAmountLimits } from '../utils/market'
import { useMarketPrices } from './query/useMarketPrices'

export const useUpdateTradingAmounts = () => {
  const [[minBuyAmount, maxBuyAmount], setBuyAmountRange] = useOfferPreferences(
    (state) => [state.buyAmountRange, state.setBuyAmountRange],
    shallow,
  )
  const [setMinTradingAmount, setMaxTradingAmount] = useConfigStore(
    (state) => [state.setMinTradingAmount, state.setMaxTradingAmount],
    shallow,
  )

  const updateBuyTradingAmounts = useCallback(
    (priceCHF: number) => {
      const [newMinBuyAmount, newMaxBuyAmount] = getTradingAmountLimits(priceCHF, 'buy')
      setMinTradingAmount(newMinBuyAmount)
      setMaxTradingAmount(newMaxBuyAmount)

      if (minBuyAmount < newMinBuyAmount || maxBuyAmount > newMaxBuyAmount) {
        const newMinAmount = Math.max(newMinBuyAmount, minBuyAmount)
        setBuyAmountRange([newMinAmount, newMaxBuyAmount])
      }
    },
    [maxBuyAmount, minBuyAmount, setBuyAmountRange, setMaxTradingAmount, setMinTradingAmount],
  )

  const { data: prices } = useMarketPrices()
  useEffect(() => {
    if (prices?.CHF) updateBuyTradingAmounts(prices.CHF)
  }, [prices, updateBuyTradingAmounts])
}
