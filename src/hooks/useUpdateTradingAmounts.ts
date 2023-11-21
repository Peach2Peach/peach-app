import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useConfigStore } from '../store/configStore/configStore'
import { useOfferPreferences } from '../store/offerPreferenes/useOfferPreferences'
import { getTradingAmountLimits } from '../utils/market'

export const useUpdateTradingAmounts = () => {
  const [sellAmount, setSellAmount, [minBuyAmount, maxBuyAmount], setBuyAmountRange] = useOfferPreferences(
    (state) => [state.sellAmount, state.setSellAmount, state.buyAmountRange, state.setBuyAmountRange],
    shallow,
  )
  const [setMinTradingAmount, setMaxTradingAmount, setMaxSellTradingAmount] = useConfigStore(
    (state) => [state.setMinTradingAmount, state.setMaxTradingAmount, state.setMaxSellTradingAmount],
    shallow,
  )

  const updateBuyTradingAmounts = useCallback(
    (priceCHF: number) => {
      const [newMinBuyAmount, newMaxBuyAmount] = getTradingAmountLimits(priceCHF, 'buy')
      setMinTradingAmount(newMinBuyAmount)
      setMaxTradingAmount(newMaxBuyAmount)

      if (minBuyAmount < newMinBuyAmount || maxBuyAmount > newMaxBuyAmount) {
        const newMinAmount = Math.max(newMinBuyAmount, minBuyAmount)
        const newMaxAmount = Math.min(newMaxBuyAmount, maxBuyAmount)
        setBuyAmountRange([newMinAmount, newMaxBuyAmount], { min: newMinAmount, max: newMaxAmount })
      }
    },
    [maxBuyAmount, minBuyAmount, setBuyAmountRange, setMaxTradingAmount, setMinTradingAmount],
  )
  const updateSellTradingAmounts = useCallback(
    (priceCHF: number) => {
      const [newMinSellAmount, newMaxSellAmount] = getTradingAmountLimits(priceCHF, 'sell')
      setMaxSellTradingAmount(newMaxSellAmount)

      if (sellAmount < newMinSellAmount) {
        setSellAmount(newMinSellAmount, { min: newMinSellAmount, max: newMaxSellAmount })
      } else if (sellAmount > newMaxSellAmount) {
        setSellAmount(newMaxSellAmount, { min: newMinSellAmount, max: newMaxSellAmount })
      }
    },
    [sellAmount, setMaxSellTradingAmount, setSellAmount],
  )

  const updateTradingAmounts = useCallback(
    (priceCHF: number) => {
      updateBuyTradingAmounts(priceCHF)
      updateSellTradingAmounts(priceCHF)
    },
    [updateBuyTradingAmounts, updateSellTradingAmounts],
  )

  return updateTradingAmounts
}
