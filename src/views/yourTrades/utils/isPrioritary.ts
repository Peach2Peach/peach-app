const prioritaryStatus: TradeStatus[] = [
  'dispute',
  'releaseEscrow',
  'fundingAmountDifferent',
  'confirmCancelation',
  'refundAddressRequired',
  'refundTxSignatureRequired',
  'refundOrReviveRequired',
]

export const isPrioritary = (tradeStatus: TradeStatus) => prioritaryStatus.includes(tradeStatus)
