import { IconType } from '../../../assets/icons'

export const statusIcons: Record<TradeStatus, IconType> = {
  fundEscrow: 'downloadCloud',
  searchingForPeer: 'search',
  fundingAmountDifferent: 'uploadCloud',
  escrowWaitingForConfirmation: 'clock',
  hasMatchesAvailable: 'checkCircle',
  refundAddressRequired: 'edit',
  refundTxSignatureRequired: 'alertOctagon',
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
