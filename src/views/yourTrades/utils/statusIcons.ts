import { IconType } from '../../../assets/icons'

export const statusIcons: Record<TradeStatus, IconType> = {
  fundEscrow: 'downloadCloud',
  searchingForPeer: 'search',
  escrowWaitingForConfirmation: 'clock',
  hasMatchesAvailable: 'checkCircle',
  refundTxSignatureRequired: 'alertOctagon',
  messageSigningRequired: 'alertOctagon',
  paymentRequired: 'dollarSign',
  confirmPaymentRequired: 'dollarSign',
  dispute: 'alertOctagon',
  rateUser: 'heart',
  confirmCancelation: 'xCircle',
  waiting: 'clock',
  offerCanceled: 'crossOutlined',
  tradeCanceled: 'crossOutlined',
  tradeCompleted: 'checkCircle',
}
