import { View } from 'react-native'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import { BTCAmount } from '../../../components/bitcoin'

type Props = {
  label: string
  amount: number
}

export const LabelAndAmount = ({ label, amount }: Props) => (
  <View style={tw`flex-row`}>
    <Text style={tw`w-20 text-black-3`}>{label}</Text>
    <BTCAmount amount={amount} size="small" />
  </View>
)
