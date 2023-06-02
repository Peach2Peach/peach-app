import { Icon } from '../../../components'
import tw from '../../../styles/tailwind'

export const iconMap: Record<TransactionType, JSX.Element> = {
  TRADE: <Icon id="download" color={tw`text-success-main`.color} />,
  WITHDRAWAL: <Icon id="upload" color={tw`text-primary-main`.color} />,
  DEPOSIT: <Icon id="download" color={tw`text-success-main`.color} />,
  REFUND: <Icon id="download" color={tw`text-black-3`.color} />,
}
