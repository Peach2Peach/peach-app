import { View } from 'react-native'
import i18n from '../../utils/i18n'
import { BTCAmount } from '../bitcoin'
import { CopyAble } from '../ui'
import { SummaryItem, SummaryItemProps } from './SummaryItem'
import tw from '../../styles/tailwind'

type Props = Omit<SummaryItemProps, 'title'> & {
  amount: number
}

export const AmountSummaryItem = ({ amount, ...props }: Props) => (
  <SummaryItem {...props} title={i18n('amount')}>
    <View style={tw`flex-row items-center gap-2`}>
      <BTCAmount amount={amount} size="small" />
      <CopyAble value={String(amount)} />
    </View>
  </SummaryItem>
)
