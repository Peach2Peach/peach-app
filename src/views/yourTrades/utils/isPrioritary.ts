const prioritaryStatus = [
  'dispute',
  'fundingAmountDifferent',
  'confirmCancelation',
  'refundTxSignatureRequired',
  'refundOrReviveRequired',
]

export const isPrioritary = (tradeStatus: TradeStatus) => prioritaryStatus.includes(tradeStatus)
