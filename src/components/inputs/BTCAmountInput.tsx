import { TextInput, TextInputProps, View, ViewStyle } from 'react-native'
import tw from '../../styles/tailwind'
import { BTCAmount } from '../bitcoin/btcAmount/BTCAmount'

type Props = {
  amount: number
  onChangeText: TextInputProps['onChangeText']
  style?: ViewStyle
}

export function BTCAmountInput ({ amount, onChangeText, style }: Props) {
  return (
    <View
      style={[
        tw`self-stretch justify-center px-2 py-3 overflow-hidden h-38px rounded-xl`,
        tw`border bg-primary-background-light border-black-65`,
        style,
      ]}
    >
      <BTCAmount size="medium" amount={amount} />
      <TextInput
        style={tw`absolute grow w-full py-0 opacity-0 h-38px input-text`}
        keyboardType="number-pad"
        value={amount.toString()}
        onChangeText={onChangeText}
        testID="btc-amount-input"
      />
    </View>
  )
}
