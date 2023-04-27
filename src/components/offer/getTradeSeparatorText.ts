import i18n from '../../utils/i18n'

export const getTradeSeparatorText = (tradeStatus: TradeStatus) => {
  if (tradeStatus === 'tradeCanceled') {
    return i18n('contract.tradeCanceled')
  }
  if (tradeStatus === 'refundOrReviveRequired') {
    return i18n('contract.disputeResolved')
  }
  return i18n('contract.tradeCompleted')
}
