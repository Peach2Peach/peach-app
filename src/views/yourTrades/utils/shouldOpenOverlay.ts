const statusForOverlay = ['fundingAmountDifferent', 'refundTxSignatureRequired']
export const shouldOpenOverlay = (tradeStatus: TradeStatus) => statusForOverlay.includes(tradeStatus)
