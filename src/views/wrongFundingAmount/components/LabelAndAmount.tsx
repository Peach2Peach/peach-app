import { View } from 'react-native'
import { SatsFormat, Text } from '../../../components'
import tw from '../../../styles/tailwind'

type Props = {
  label: string
  amount: number
}

export const LabelAndAmount = ({ label, amount }: Props) => (
  <View style={tw`flex-row`}>
    <Text style={tw`w-20 text-black-3`}>{label}</Text>
    <SatsFormat sats={amount} satsStyle={tw`text-3xs`} />
  </View>
)
