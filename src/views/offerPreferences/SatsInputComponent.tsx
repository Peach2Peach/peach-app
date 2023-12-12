import { forwardRef } from 'react'
import { TextInput, TextInputProps, View } from 'react-native'
import { BTCAmount } from '../../components/bitcoin/btcAmount/BTCAmount'
import tw from '../../styles/tailwind'
import { inputContainerStyle, textStyle } from './SellOfferPreferences'

export const SatsInputComponent = forwardRef<TextInput, TextInputProps>((props, ref) => (
  <View style={[tw.style(inputContainerStyle), tw`py-2`]}>
    <BTCAmount size="small" amount={Number(props.value)} />
    <TextInput
      {...props}
      ref={ref}
      style={[tw.style(textStyle), tw`absolute w-full opacity-0`]}
      keyboardType="number-pad"
    />
  </View>
))
