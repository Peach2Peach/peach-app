import { IconType } from '../../../assets/icons'

export const statusIcons: Record<TradeStatus, IconType> = {
  fundEscrow: 'downloadCloud',
  searchingForPeer: 'search',
  offerHidden: 'eyeOff',
  offerHiddenWithMatchesAvailable: 'checkCircle',
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
  waiting: 'dollarSign',
  offerCanceled: 'crossOutlined',
  tradeCanceled: 'crossOutlined',
  refundOrReviveRequired: 'crossOutlined',
  tradeCompleted: 'checkCircle',
}
