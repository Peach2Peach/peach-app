const statusForPopup = ['refundTxSignatureRequired']
export const shouldOpenPopup = (tradeStatus: TradeStatus) => statusForPopup.includes(tradeStatus)
