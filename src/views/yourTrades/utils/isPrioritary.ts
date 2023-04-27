const prioritaryStatus: TradeStatus[] = [
  'releaseEscrow',
  'fundingAmountDifferent',
  'confirmCancelation',
  'refundAddressRequired',
  'refundTxSignatureRequired',
  'refundOrReviveRequired',
]

export const isPrioritary = (tradeStatus: TradeStatus) => prioritaryStatus.includes(tradeStatus)
