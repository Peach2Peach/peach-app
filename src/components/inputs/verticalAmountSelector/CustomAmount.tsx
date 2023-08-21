import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { PriceFormat, SatsFormat } from '../../text'
import { Input } from '../Input'
import { useCustomAmountSetup } from './hooks/useCustomAmountSetup'

type Props = ComponentProps & {
  amount: number
  onChange: (amount: number) => void
}

export const CustomAmount = ({ amount, onChange, style }: Props) => {
  amount ||= 0
  const { updateCustomAmount, clearCustomAmount, customFiatPrice, updateCustomFiatAmount, displayCurrency }
    = useCustomAmountSetup({ amount, onChange })

  return (
    <View style={[tw`gap-2`, style]}>
      <View style={tw`h-8`}>
        <View style={[tw`px-3 h-8 justify-center border rounded-full border-black-4 w-[210px] absolute`]}>
          <SatsFormat sats={amount} style={tw`text-lg`} satsStyle={tw`font-bold`} />
        </View>
        <Input
          style={[tw`w-full h-8 p-0 text-xl opacity-0`]}
          keyboardType="number-pad"
          value={amount.toString()}
          onChange={updateCustomAmount}
          onFocus={clearCustomAmount}
        />
      </View>
      <View style={tw`h-8`}>
        <View style={[tw`absolute justify-center h-8 pl-3 pr-4 border rounded-full border-black-4`]}>
          <PriceFormat
            amount={customFiatPrice}
            currency={displayCurrency}
            style={tw`text-lg font-courier-prime text-black-1`}
          />
        </View>
        <Input
          style={[tw`w-full h-8 p-0 text-xl opacity-0`]}
          keyboardType="number-pad"
          value={customFiatPrice.toString()}
          onChange={updateCustomFiatAmount}
          onFocus={clearCustomAmount}
        />
      </View>
    </View>
  )
}
