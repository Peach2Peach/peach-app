import { useState } from 'react'
import { TextInput, TextInputProps, View, ViewStyle } from 'react-native'
import tw from '../../styles/tailwind'
import { BTCAmount } from '../bitcoin/BTCAmount'

type Props = {
  amount: number
  onChangeText: TextInputProps['onChangeText']
  style?: ViewStyle
}

export function BTCAmountInput ({ amount, onChangeText, style }: Props) {
  const [isFocused, setIsFocused] = useState(false)
  return (
    <View
      style={[
        tw`self-stretch justify-center px-2 py-3 overflow-hidden h-38px rounded-xl`,
        tw`border bg-primary-background-light border-black-65`,
        isFocused && tw`border-2 border-primary-main`,
        style,
      ]}
    >
      <BTCAmount size="medium" amount={amount} />
      <TextInput
        style={tw`absolute w-full py-0 opacity-0 grow h-38px input-text`}
        keyboardType="number-pad"
        value={amount.toString()}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        testID="btc-amount-input"
      />
    </View>
  )
}
