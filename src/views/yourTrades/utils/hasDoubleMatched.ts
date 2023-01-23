const contractStatus = [
  'paymentRequired',
  'confirmPaymentRequired',
  'dispute',
  'rateUser',
  'confirmCancelation',
  'tradeCompleted',
  'tradeCanceled',
]

export const hasDoubleMatched = (tradeStatus: TradeStatus) => contractStatus.includes(tradeStatus)
