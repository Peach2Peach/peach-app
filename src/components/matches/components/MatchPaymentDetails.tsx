import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { Divider } from '../../Divider'
import { PaymentMethod } from '../../paymentMethod'
import { Text } from '../../text'
import { useMatchStore } from '../store'

export const MatchPaymentDetails = ({ match, style }: ComponentProps & { match: Match }) => {
  const [selectedCurrency, selectedPaymentMethod] = useMatchStore(
    (state) => [
      state.matchSelectors[match.offerId]?.selectedCurrency,
      state.matchSelectors[match.offerId]?.selectedPaymentMethod,
    ],
    shallow,
  )
  return (
    <View style={[tw`gap-1`, tw.md`gap-3`, style]}>
      <Divider text={i18n('paymentMethod')} />
      <View style={tw`flex-row gap-1`}>
        <PaymentMethod paymentMethod={selectedPaymentMethod} />
        <Text style={tw`px-2 border rounded-lg border-black-1 button-medium`}>{selectedCurrency}</Text>
      </View>
    </View>
  )
}
