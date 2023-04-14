import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useConfigStore } from '../store/configStore'
import { useSettingsStore } from '../store/settingsStore'
import { getTradingAmountLimits } from '../utils/market'

export const useUpdateTradingAmounts = () => {
  const [sellAmount, setSellAmount, minBuyAmount, setMinBuyAmount, maxBuyAmount, setMaxBuyAmount] = useSettingsStore(
    (state) => [
      state.sellAmount,
      state.setSellAmount,
      state.minBuyAmount,
      state.setMinBuyAmount,
      state.maxBuyAmount,
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
