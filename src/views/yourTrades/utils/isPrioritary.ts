const prioritaryStatus = [
  'dispute',
  'messageSigningRequired',
  'fundingAmountDifferent',
  'confirmCancelation',
  'refundTxSignatureRequired',
]

export const isPrioritary = (tradeStatus: TradeStatus) => prioritaryStatus.includes(tradeStatus)
