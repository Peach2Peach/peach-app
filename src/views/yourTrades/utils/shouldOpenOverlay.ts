const statusForOverlay = ['refundTxSignatureRequired']
export const shouldOpenOverlay = (tradeStatus: TradeStatus) => statusForOverlay.includes(tradeStatus)
