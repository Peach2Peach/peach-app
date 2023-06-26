import { Icon } from '../../../components'
import tw from '../../../styles/tailwind'

export const iconMap: Record<TransactionType, JSX.Element> = {
  TRADE: <Icon size={17} id="download" color={tw`text-success-main`.color} />,
  WITHDRAWAL: <Icon size={17} id="upload" color={tw`text-primary-main`.color} />,
  DEPOSIT: <Icon size={17} id="download" color={tw`text-success-main`.color} />,
  REFUND: <Icon size={17} id="download" color={tw`text-black-3`.color} />,
}
