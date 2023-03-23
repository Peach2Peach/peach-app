const waitingStatus = ['escrowWaitingForConfirmation', 'searchingForPeer', 'offerHidden']
export const isWaiting = (type: Offer['type'], tradeStatus: TradeStatus) =>
  waitingStatus.includes(tradeStatus)
  || (tradeStatus === 'paymentRequired' && type === 'ask')
  || (tradeStatus === 'confirmPaymentRequired' && type === 'bid')
