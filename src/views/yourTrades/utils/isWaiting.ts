export const isWaiting = (type: Offer['type'], tradeStatus: TradeStatus) =>
  /escrowWaitingForConfirmation|searchingForPeer/u.test(tradeStatus)
  || (tradeStatus === 'paymentRequired' && type === 'ask')
  || (tradeStatus === 'confirmPaymentRequired' && type === 'bid')
