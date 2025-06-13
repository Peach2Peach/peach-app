export const shouldGoToTradeRequestChat = (
  data: PNData,
): data is PNData & { offerId: string; requestingUserId: string } =>
  !!data.offerId && !!data.requestingUserId && data.isChat === "true";

export const shouldGoToMatchChat = (
  data: PNData,
): data is PNData & { offerId: string; matchingOfferId: string } =>
  !!data.offerId && !!data.matchingOfferId && data.isChat === "true";

export const shouldGoToContractChat = (
  data: PNData,
): data is PNData & { contractId: string } =>
  !!data.contractId && data.isChat === "true";
