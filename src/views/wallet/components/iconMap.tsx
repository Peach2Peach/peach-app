import { Icon } from '../../../components'
import tw from '../../../styles/tailwind'

export const iconMap: Record<TransactionType, JSX.Element> = {
  TRADE: <Icon size={17} id="buy" color={tw`text-success-main`.color} />,
  ESCROWFUNDED: <Icon size={17} id="sell" color={tw`text-primary-main`.color} />,
  WITHDRAWAL: <Icon size={17} id="arrowUpCircle" color={tw`text-primary-main`.color} />,
  DEPOSIT: <Icon size={17} id="arrowDownCircle" color={tw`text-success-main`.color} />,
  REFUND: <Icon size={17} id="rotateCounterClockwise" color={tw`text-black-3`.color} />,
}
