export const tradeRequestKeys = {
  all: ["tradeRequests"] as const,
  tradeRequest: (offerId: string, requestingOfferId = "none") =>
    [...tradeRequestKeys.all, offerId, requestingOfferId] as const,
  tradeRequestForBuyOffer: (offerId: string, requestingOfferId = "none") =>
    [
      ...tradeRequestKeys.tradeRequest(offerId, requestingOfferId),
      "buy",
    ] as const,
  tradeRequestForSellOffer: (offerId: string, requestingOfferId = "none") =>
    [
      ...tradeRequestKeys.tradeRequest(offerId, requestingOfferId),
      "sell",
    ] as const,
  tradeRequestsForSellOffer: (offerId: string) =>
    [...tradeRequestKeys.all, "sell", offerId] as const,
  tradeRequestsForBuyOffer: (offerId: string) =>
    [...tradeRequestKeys.all, "buy", offerId] as const,
};
