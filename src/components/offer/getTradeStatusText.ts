import i18n from '../../utils/i18n'

export const getTradeStatusText = (disputeActive: boolean, tradeStatus: TradeStatus) => {
  if (disputeActive || tradeStatus === 'confirmPaymentRequired') {
    return i18n('trade.disputeActive')
  }
  return i18n('trade.paymentDetails')
}
