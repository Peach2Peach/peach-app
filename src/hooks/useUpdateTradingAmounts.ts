import { useCallback } from 'react'
import shallow from 'zustand/shallow'
import { useConfigStore } from '../store/configStore'
import { useSettingsStore } from '../store/settingsStore'
import { getTradingAmountLimits } from '../utils/market'

export const useUpdateTradingAmounts = () => {
  const [minAmount, setMinAmount, maxAmount, setMaxAmount] = useSettingsStore(
    (state) => [state.minAmount, state.setMinAmount, state.maxAmount, state.setMaxAmount],
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
      if (minAmount < newMinAmount) setMinAmount(newMinAmount)
      if (maxAmount > newMaxAmount) setMaxAmount(newMaxAmount)
    },
    [maxAmount, minAmount, setMaxAmount, setMaxTradingAmount, setMinAmount, setMinTradingAmount],
  )

  return updateTradingAmounts
}
