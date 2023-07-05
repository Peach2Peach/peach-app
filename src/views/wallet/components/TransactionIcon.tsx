import { ColorValue } from 'react-native'
import { IconType } from '../../../assets/icons'
import { Icon } from '../../../components'
import tw from '../../../styles/tailwind'

type TxIcon = {
  id: IconType
  color: ColorValue | undefined
}

const iconMap: Record<TransactionType, TxIcon> = {
  TRADE: { id: 'buy', color: tw`text-success-main`.color },
  ESCROWFUNDED: { id: 'sell', color: tw`text-primary-main`.color },
  WITHDRAWAL: { id: 'arrowUpCircle', color: tw`text-primary-main`.color },
  DEPOSIT: { id: 'arrowDownCircle', color: tw`text-success-main`.color },
  REFUND: { id: 'rotateCounterClockwise', color: tw`text-black-3`.color },
}

type Props = {
  type: TransactionType
  size: number
}

export const TransactionIcon = ({ type, size }: Props) => (
  <Icon size={size} id={iconMap[type].id} color={iconMap[type].color} />
)
