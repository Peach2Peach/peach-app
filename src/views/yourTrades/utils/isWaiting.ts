export const isWaiting = (type: Offer['type'], tradeStatus: TradeStatus) =>
  /escrowWaitingForConfirmation|searchingForPeer|offerHidden/u.test(tradeStatus)
  || (tradeStatus === 'paymentRequired' && type === 'ask')
  || (tradeStatus === 'confirmPaymentRequired' && type === 'bid')
