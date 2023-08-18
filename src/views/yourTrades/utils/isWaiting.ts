const waitingStatus = ['escrowWaitingForConfirmation', 'searchingForPeer', 'offerHidden', 'payoutPending']
export const isWaiting = (type: Offer['type'], tradeStatus: TradeStatus) =>
  waitingStatus.includes(tradeStatus)
  || (tradeStatus === 'paymentRequired' && type === 'ask')
  || (tradeStatus === 'confirmPaymentRequired' && type === 'bid')
