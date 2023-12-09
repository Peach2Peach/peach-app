import { shallow } from 'zustand/shallow'
import { RangeAmount } from '../../components/inputs/verticalAmountSelector/RangeAmount'
import { useConfigStore } from '../../store/configStore/configStore'
import { useOfferPreferences } from '../../store/offerPreferenes'
import tw from '../../styles/tailwind'

export const BuyAmountSelector = ({ style }: ComponentProps) => {
  const [amountRange, setBuyAmountRange] = useOfferPreferences(
    (state) => [state.buyAmountRange, state.setBuyAmountRange],
    shallow,
  )
  const [minTradingAmount, maxTradingAmount] = useConfigStore(
    (state) => [state.minTradingAmount, state.maxTradingAmount],
    shallow,
  )

  return (
    <RangeAmount
      style={[tw`h-full shrink`, style]}
      min={minTradingAmount}
      max={maxTradingAmount}
      value={amountRange}
      onChange={setBuyAmountRange}
    />
  )
}
