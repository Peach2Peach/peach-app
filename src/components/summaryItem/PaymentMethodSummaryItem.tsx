import { View } from 'react-native'
import i18n from '../../utils/i18n'
import { SummaryItem, SummaryItemProps } from './SummaryItem'
import tw from '../../styles/tailwind'
import { BTCAmount } from '../bitcoin'

type Props = SummaryItemProps & {
  paymentMethod: PaymentMethod
}

export const PaymentMethodSummaryItem = ({ amount, ...props }: Props) => (
  <SummaryItem {...props} title={i18n('amount')}>
    <View style={tw`flex-row items-center gap-2`}>
      <BTCAmount amount={amount} size="small" />
    </View>
  </SummaryItem>
)
