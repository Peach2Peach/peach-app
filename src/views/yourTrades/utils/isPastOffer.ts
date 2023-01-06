export const isPastOffer = (tradeStatus: TradeStatus) => /tradeCompleted|tradeCanceled|offerCanceled/u.test(tradeStatus)
