import { forwardRef } from 'react'
import { TextInput, TextInputProps } from 'react-native'
import { BTCAmountInput } from '../../../components/inputs/BTCAmountInput'
import tw from '../../../styles/tailwind'
import { inputContainerStyle } from '../SellOfferPreferences'

export const textStyle = 'text-center subtitle-1 leading-relaxed py-1px text-black-100 android:h-7'

export const SatsInputComponent = forwardRef<TextInput, TextInputProps>((props, ref) => (
  <BTCAmountInput
    {...props}
    ref={ref}
    containerStyle={[tw.style(inputContainerStyle), tw`py-2`]}
    textStyle={[tw.style(textStyle), tw`absolute w-full opacity-0`]}
  />
))
