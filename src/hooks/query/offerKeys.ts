export const offerKeys = {
  all: ["offers"] as const,
  single: ["offer"] as const,
  summary: ["offerSummary"] as const,
  summaries: () => [...offerKeys.all, "summaries"] as const,
  publicOffer: (id: string) => [...offerKeys.single, id] as const,
  publicBuySummary: (id: string, requestingOfferId = "none") =>
    [...offerKeys.summary, "buy", id, requestingOfferId] as const,
  publicSellSummary: (id: string, requestingOfferId = "none") =>
    [...offerKeys.summary, "sell", id, requestingOfferId] as const,
  tradeRequest: (id: string, requestingOfferId = "none") =>
    [...offerKeys.publicOffer(id), requestingOfferId, "tradeRequest"] as const,
  details: () => [...offerKeys.all, "details"] as const,
  detail: (id: string) => [...offerKeys.details(), id] as const,
  buyPreferences: (id = "none") =>
    [...offerKeys.detail(id), "buyPreferences"] as const,
  sellPreferences: (id = "none") =>
    [...offerKeys.detail(id), "sellPreferences"] as const,
  escrowInfo: (id: string) => [...offerKeys.detail(id), "escrowInfo"] as const,
  fundingStatus: (id: string) =>
    [...offerKeys.detail(id), "fundingStatus"] as const,
};
