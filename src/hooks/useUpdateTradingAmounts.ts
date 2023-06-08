import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useConfigStore } from '../store/configStore'
import { useOfferPreferences } from '../store/useOfferPreferences'
import { getTradingAmountLimits } from '../utils/market'

export const useUpdateTradingAmounts = () => {
  const [sellAmount, setSellAmount, [minBuyAmount, maxBuyAmount], setMinBuyAmount, setMaxBuyAmount]
    = useOfferPreferences(
      (state) => [
        state.sellPreferences.amount,
        state.setSellAmount,
        state.buyPreferences.amount,
        state.setMinBuyAmount,
        state.setMaxBuyAmount,
      ],
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
      if (sellAmount < newMinAmount) setSellAmount(newMinAmount)
      if (minBuyAmount < newMinAmount) setMinBuyAmount(newMinAmount)
      if (maxBuyAmount > newMaxAmount) setMaxBuyAmount(newMaxAmount)
    },
    [
      maxBuyAmount,
      minBuyAmount,
      sellAmount,
      setMaxBuyAmount,
      setMaxTradingAmount,
      setMinBuyAmount,
      setMinTradingAmount,
      setSellAmount,
    ],
  )

  return updateTradingAmounts
}
