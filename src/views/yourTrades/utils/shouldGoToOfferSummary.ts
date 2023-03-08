const statusThatLeadToOfferSummary = ['offerCanceled']

export const shouldGoToOfferSummary = (status: TradeStatus) => statusThatLeadToOfferSummary.includes(status)
