// questionable if this is the right place to go

const statusThatLeadToOfferSummary = ['offerCanceled', 'tradeCompleted', 'tradeCanceled']

export const shouldGoToOfferSummary = (status: TradeStatus) => statusThatLeadToOfferSummary.includes(status)
