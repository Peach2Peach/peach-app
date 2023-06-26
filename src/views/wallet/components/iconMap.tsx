import { Icon } from '../../../components'
import tw from '../../../styles/tailwind'

export const iconMap: Record<TransactionType, JSX.Element> = {
  TRADE: <Icon id="buy" color={tw`text-success-main`.color} />,
  ESCROWFUNDED: <Icon id="sell" color={tw`text-primary-main`.color} />,
  WITHDRAWAL: <Icon id="arrowUpCircle" color={tw`text-primary-main`.color} />,
  DEPOSIT: <Icon id="arrowDownCircle" color={tw`text-success-main`.color} />,
  REFUND: <Icon id="rotateCounterClockwise" color={tw`text-black-3`.color} />,
}
