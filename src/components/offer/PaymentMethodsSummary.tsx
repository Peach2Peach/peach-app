import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { MeansOfPaymentSelect } from '../trade'
import { TradeSeparator } from './TradeSeparator'

type Props = {
  meansOfPayment: MeansOfPayment
}
export const PaymentMethodsSummary = ({ meansOfPayment }: Props) => (
  <View style={[tw`gap-1`, tw.md`gap-3`]}>
    <TradeSeparator text={i18n('paymentMethods.title')} />
    <MeansOfPaymentSelect meansOfPayment={meansOfPayment} />
  </View>
)
