import i18n from '../../utils/i18n'

export const getTradeSeparatorText = (tradeStatus: TradeStatus) => {
  console.log('TradeStatus:', tradeStatus)
  if (tradeStatus === 'tradeCanceled') {
    return i18n('contract.tradeCanceled')
  }
  if (tradeStatus === 'refundOrReviveRequired') {
    return i18n('contract.disputeResolved')
  }
  if (tradeStatus === 'tradeCompleted') {
    return i18n('contract.paymentDetails')
  }
  return i18n('contract.tradeCompleted')
}
