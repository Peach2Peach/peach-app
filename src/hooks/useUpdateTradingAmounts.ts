import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useConfigStore } from '../store/configStore'
import { useOfferPreferences } from '../store/offerPreferenes/useOfferPreferences'
import { getTradingAmountLimits } from '../utils/market'

export const useUpdateTradingAmounts = () => {
  const [sellAmount, setSellAmount, [minBuyAmount, maxBuyAmount], setBuyAmountRange] = useOfferPreferences(
    (state) => [state.sellAmount, state.setSellAmount, state.buyAmountRange, state.setBuyAmountRange],
    shallow,
  )
  const [setMinTradingAmount, setMaxTradingAmount] = useConfigStore(
    (state) => [state.setMinTradingAmount, state.setMaxTradingAmount],
    shallow,
  )

  const updateTradingAmounts = useCallback(
    (priceCHF: number) => {
      const [newMinAmount, newMaxAmount] = getTradingAmountLimits(priceCHF)
      setMinTradingAmount(newMinAmount)
      setMaxTradingAmount(newMaxAmount)
      if (sellAmount < newMinAmount) setSellAmount(newMinAmount, { min: newMinAmount, max: newMaxAmount })
      if (minBuyAmount < newMinAmount || maxBuyAmount > newMaxAmount) {
        const newMinBuyAmount = Math.max(newMinAmount, minBuyAmount)
        const newMaxBuyAmount = Math.min(newMaxAmount, maxBuyAmount)
        setBuyAmountRange([newMinBuyAmount, newMaxBuyAmount], { min: newMinAmount, max: newMaxAmount })
      }
    },
    [maxBuyAmount, minBuyAmount, sellAmount, setBuyAmountRange, setMaxTradingAmount, setMinTradingAmount, setSellAmount],
  )

  return updateTradingAmounts
}
