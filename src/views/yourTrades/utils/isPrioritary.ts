const prioritaryStatus = [
  'dispute',
  'fundingAmountDifferent',
  'confirmCancelation',
  'refundAddressRequired',
  'refundTxSignatureRequired',
  'refundOrReviveRequired',
]

export const isPrioritary = (tradeStatus: TradeStatus) => prioritaryStatus.includes(tradeStatus)
