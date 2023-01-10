const statusThatLeadToOfferSummary = ['searchingForPeer', 'offerCanceled', 'tradeCompleted', 'tradeCanceled']

export const shouldGoToOfferSummary = (status: TradeStatus) => statusThatLeadToOfferSummary.includes(status)
