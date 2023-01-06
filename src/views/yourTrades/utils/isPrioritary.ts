export const isPrioritary = (tradeStatus: TradeStatus) =>
  /dispute|confirmCancelation|refundTxSignatureRequired/u.test(tradeStatus)
