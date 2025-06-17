export const tradeRequestKeys = {
  all: ["tradeRequests"] as const,
  single: ["tradeRequest"] as const,
  tradeRequest: (offerId: string, requestingOfferId = "none") =>
    [...tradeRequestKeys.single, offerId, requestingOfferId] as const,
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
  details: () => [...tradeRequestKeys.all, "details"] as const,
  isAllowedToChat: (offerId: string, requestingUserId: string) =>
    [
      ...tradeRequestKeys.detail(offerId, requestingUserId),
      "isAllowedToChat",
    ] as const,
  detail: (offerId: string, requestingUserId: string) =>
    [...tradeRequestKeys.details(), `${offerId}-${requestingUserId}`] as const,
  decryptedData: (offerId: string, requestingUserId: string) =>
    [
      ...tradeRequestKeys.detail(offerId, requestingUserId),
      "decryptedData",
    ] as const,
  chat: (offerId: string, requestingUserId: string) =>
    [...tradeRequestKeys.detail(offerId, requestingUserId), "chat"] as const,
};
