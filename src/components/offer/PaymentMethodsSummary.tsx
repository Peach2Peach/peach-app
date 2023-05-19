import { View } from 'react-native'
import i18n from '../../utils/i18n'
import { MeansOfPaymentSelect } from '../trade'
import { TradeSeparator } from './TradeSeparator'

type Props = {
  meansOfPayment: MeansOfPayment
}
export const PaymentMethodsSummary = ({ meansOfPayment }: Props) => (
  <View>
    <TradeSeparator text={i18n('paymentMethods.title')} />
    <MeansOfPaymentSelect meansOfPayment={meansOfPayment} />
  </View>
)
