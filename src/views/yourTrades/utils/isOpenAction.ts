export const isOpenAction = (type: Offer['type'], tradeStatus: TradeStatus) =>
  /fundEscrow|hasMatchesAvailable|rateUser/u.test(tradeStatus)
  || (tradeStatus === 'confirmPaymentRequired' && type === 'ask')
  || (tradeStatus === 'paymentRequired' && type === 'bid')
