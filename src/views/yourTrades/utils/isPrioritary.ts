const prioritaryStatus = ['dispute', 'confirmCancelation', 'refundTxSignatureRequired', 'tradeCanceled', 'offerCanceled']

export const isPrioritary = (tradeStatus: TradeStatus) => prioritaryStatus.includes(tradeStatus)
