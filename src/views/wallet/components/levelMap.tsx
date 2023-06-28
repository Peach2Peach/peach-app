import { statusCardStyles } from '../../../components/statusCard/StatusCard'

export const levelMap: Record<TransactionType, keyof typeof statusCardStyles.bg> = {
  TRADE: 'success',
  WITHDRAWAL: 'primary',
  ESCROWFUNDED: 'primary',
  DEPOSIT: 'success',
  REFUND: 'black',
}
