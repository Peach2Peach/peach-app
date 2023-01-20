const statusForOverlay = ['fundingAmountDifferent', 'refundTxSignatureRequired']
export const shouldOpenRefundOverlay = (tradeStatus: TradeStatus) => statusForOverlay.includes(tradeStatus)
