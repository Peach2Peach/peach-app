import { statusCardStyles } from '../../../components/statusCard/StatusCard'

export const levelMap: Record<TransactionType, keyof typeof statusCardStyles.bg> = {
  TRADE: 'green',
  WITHDRAWAL: 'orange',
  DEPOSIT: 'green',
  REFUND: 'gray',
}
