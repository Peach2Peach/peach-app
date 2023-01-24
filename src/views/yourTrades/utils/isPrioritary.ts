const prioritaryStatus = [
  'dispute',
  'messageSigningRequired',
  'fundingAmountDifferent',
  'confirmCancelation',
  'refundTxSignatureRequired',
  'tradeCompleted',
  'tradeCanceled',
  'offerCanceled',
]

export const isPrioritary = (tradeStatus: TradeStatus) => prioritaryStatus.includes(tradeStatus)
