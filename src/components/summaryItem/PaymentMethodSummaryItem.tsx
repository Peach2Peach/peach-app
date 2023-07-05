import { PaymentMethodBubble } from '../bubble'
import { SummaryItem, SummaryItemProps } from './SummaryItem'

type Props = SummaryItemProps & {
  paymentMethod: PaymentMethod
}

export const PaymentMethodSummaryItem = ({ paymentMethod, ...props }: Props) => (
  <SummaryItem {...props}>
    <PaymentMethodBubble {...{ paymentMethod }} />
  </SummaryItem>
)
