import { IconType } from '../../../assets/icons'

export const statusIcons: Record<TradeStatus, IconType | ''> = {
  fundEscrow: 'downloadCloud',
  searchingForPeer: 'search',
  escrowWaitingForConfirmation: 'clock',
  hasMatchesAvailable: 'checkCircle',
  refundTxSignatureRequired: '', // TODO Ask Lab
  returnAddressRequired: '', // TODO Ask Lab
  paymentRequired: 'dollarSign',
  confirmPaymentRequired: 'dollarSign',
  dispute: 'alertOctagon',
  rateUser: 'heart',
  confirmCancelation: 'xCircle',
  offerCanceled: '',
  tradeCanceled: '',
  tradeCompleted: '',
}
