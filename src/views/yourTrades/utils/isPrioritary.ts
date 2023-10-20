const prioritaryStatus: TradeStatus[] = [
  'releaseEscrow',
  'confirmCancelation',
  'refundAddressRequired',
  'refundTxSignatureRequired',
  'refundOrReviveRequired',
  'paymentTooLate',
]

export const isPrioritary = (tradeStatus: TradeStatus) => prioritaryStatus.includes(tradeStatus)
