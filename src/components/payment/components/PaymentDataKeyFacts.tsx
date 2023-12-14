import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { PeachText } from '../../text/Text'

type Props = ComponentProps & {
  paymentData: PaymentData
}
export const PaymentDataKeyFacts = ({ paymentData, style }: Props) => (
  <View style={[tw`flex-row flex-wrap justify-center`, style]}>
    {(paymentData.currencies || []).map((currency) => (
      <View
        key={`paymentData-${paymentData.id}-currency-${currency}`}
        style={[tw`justify-center px-1 mx-1 border rounded-lg border-black-1`, style]}
      >
        <PeachText style={[tw`button-medium text-black-1`]}>{currency}</PeachText>
      </View>
    ))}
  </View>
)
