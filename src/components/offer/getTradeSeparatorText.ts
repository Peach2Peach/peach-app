import i18n from '../../utils/i18n'

export const getTradeSeparatorText = (tradeStatus: TradeStatus, paymentMethod: PaymentMethod, view: ContractViewer) => {
  if (tradeStatus === 'tradeCanceled') {
    return i18n('contract.tradeCanceled')
  }
  if (tradeStatus === 'refundOrReviveRequired') {
    return i18n('contract.disputeResolved')
  }
  if (tradeStatus === 'tradeCompleted') {
    return view === 'seller'
      ? i18n(`paymentMethod.${paymentMethod}`) + ' ' + i18n('contract.paymentDetails')
      : 'trade details'
  }
  return i18n(`paymentMethod.${paymentMethod}`) + ' ' + i18n('contract.paymentDetails')
}
