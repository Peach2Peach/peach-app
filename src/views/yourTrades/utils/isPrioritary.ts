const prioritaryStatus = [
  'dispute',
  'fundingAmountDifferent',
  'confirmCancelation',
  'refundTxSignatureRequired',
  'tradeCompleted',
  'tradeCanceled',
  'offerCanceled',
]

export const isPrioritary = (tradeStatus: TradeStatus) => prioritaryStatus.includes(tradeStatus)
