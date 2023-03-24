export const isOpenAction = (type: Offer['type'], tradeStatus: TradeStatus) =>
  /fundEscrow|hasMatchesAvailable|offerHiddenWithMatchesAvailable|rateUser/u.test(tradeStatus)
  || (tradeStatus === 'confirmPaymentRequired' && type === 'ask')
  || (tradeStatus === 'paymentRequired' && type === 'bid')
