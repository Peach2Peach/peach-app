const pastOfferStatus = ["tradeCompleted", "tradeCanceled", "offerCanceled"];

export const isPastOffer = (tradeStatus: TradeStatus) =>
  pastOfferStatus.includes(tradeStatus);
