const openActionStatus = [
  'fundEscrow',
  'fundingAmountDifferent',
  'hasMatchesAvailable',
  'offerHiddenWithMatchesAvailable',
  'rateUser',
]

export const isOpenAction = (type: Offer['type'], tradeStatus: TradeStatus) =>
  openActionStatus.includes(tradeStatus)
  || (tradeStatus === 'confirmPaymentRequired' && type === 'ask')
  || (tradeStatus === 'paymentRequired' && type === 'bid')
