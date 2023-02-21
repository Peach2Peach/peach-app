const prioritaryStatus = [
  'dispute',
  'fundingAmountDifferent',
  'confirmCancelation',
  'refundTxSignatureRequired',
]

export const isPrioritary = (tradeStatus: TradeStatus) => prioritaryStatus.includes(tradeStatus)
