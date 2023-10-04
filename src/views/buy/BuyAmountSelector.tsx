import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { RangeAmount } from '../../components/inputs/verticalAmountSelector/RangeAmount'
import { useConfigStore } from '../../store/configStore'
import { useOfferPreferences } from '../../store/offerPreferenes'
import tw from '../../styles/tailwind'

export const BuyAmountSelector = ({ style }: ComponentProps) => {
  const [amountRange, setBuyAmountRange] = useOfferPreferences(
    (state) => [state.buyAmountRange, state.setBuyAmountRange, state.canContinue.buyAmountRange],
    shallow,
  )
  const [minTradingAmount, maxTradingAmount] = useConfigStore(
    (state) => [state.minTradingAmount, state.maxTradingAmount],
    shallow,
  )

  const setSelectedRange = useCallback(
    (newRange: [number, number]) => {
      setBuyAmountRange(newRange, { min: minTradingAmount, max: maxTradingAmount })
    },
    [maxTradingAmount, minTradingAmount, setBuyAmountRange],
  )
  return (
    <RangeAmount
      style={[tw`h-full shrink`, style]}
      min={minTradingAmount}
      max={maxTradingAmount}
      value={amountRange}
      onChange={setSelectedRange}
    />
  )
}
