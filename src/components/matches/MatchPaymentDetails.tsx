import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { PeachText } from '../text/PeachText'
import { PaymentMethod } from './PaymentMethod'
import { useMatchStore } from './store'

export const MatchPaymentDetails = ({ match, style }: ComponentProps & { match: Match }) => {
  const [selectedCurrency, selectedPaymentMethod] = useMatchStore(
    (state) => [
      state.matchSelectors[match.offerId]?.selectedCurrency,
      state.matchSelectors[match.offerId]?.selectedPaymentMethod,
    ],
    shallow,
  )
  return (
    <View style={style}>
      <View style={tw`flex-row justify-between`}>
        <PeachText style={tw`text-black-2`}>{i18n('match.selectedCurrency')}</PeachText>
        <PeachText style={tw`px-2 border rounded-lg border-black-1 button-medium`}>{selectedCurrency}</PeachText>
      </View>
      <View style={tw`flex-row justify-between mt-4`}>
        <PeachText style={tw`text-black-2`}>{i18n('match.selectedPaymentMethod')}</PeachText>
        <PaymentMethod paymentMethod={selectedPaymentMethod} />
      </View>
    </View>
  )
}
