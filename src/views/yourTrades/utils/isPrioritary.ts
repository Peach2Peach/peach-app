const prioritaryStatus = [
  'dispute',
  'fundingAmountDifferent',
  'confirmCancelation',
  'refundAddressRequired',
  'refundTxSignatureRequired',
  'tradeCompleted',
  'tradeCanceled',
  'offerCanceled',
]

export const isPrioritary = (tradeStatus: TradeStatus) => prioritaryStatus.includes(tradeStatus)
