import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { Text } from '../../text'
import { PaymentMethod } from '../../paymentMethod'
import { useMatchStore } from '../store'
import { TradeSeparator } from '../../offer/TradeSeparator'

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
      <TradeSeparator text={i18n('paymentMethod')} />
      <View style={tw`flex-row gap-1`}>
        <PaymentMethod paymentMethod={selectedPaymentMethod} />
        <Text style={tw`px-2 border rounded-lg border-black-1 button-medium`}>{selectedCurrency}</Text>
      </View>
    </View>
  )
}
