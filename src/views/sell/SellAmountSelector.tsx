import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { SelectAmount } from '../../components/inputs/verticalAmountSelector/SelectAmount'
import { useOfferPreferences } from '../../store/offerPreferenes'
import tw from '../../styles/tailwind'

export const SellAmountSelector = ({ children, style }: ComponentProps) => {
  const [sellAmount, setSellAmount] = useOfferPreferences(
    (state) => [state.sellAmount, state.setSellAmount, state.canContinue.sellAmount],
    shallow,
  )
  const [minTradingAmount, maxSellTradingAmount] = [0, 21000000]

  const updateSellAmount = useCallback(
    (value: number) => {
      setSellAmount(value, { min: minTradingAmount, max: maxSellTradingAmount })
    },
    [setSellAmount, minTradingAmount, maxSellTradingAmount],
  )

  return (
    <SelectAmount
      style={[tw`h-full shrink`, style]}
      min={minTradingAmount}
      max={maxSellTradingAmount}
      value={sellAmount}
      onChange={updateSellAmount}
    >
      {children}
    </SelectAmount>
  )
}
