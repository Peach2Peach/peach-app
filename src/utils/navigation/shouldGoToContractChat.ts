export const shouldGoToTradeRequestChat = (
  data: PNData,
): data is PNData & { offerId: string } =>
  !!data.offerId && data.isChat === "true";

export const shouldGoToContractChat = (
  data: PNData,
): data is PNData & { contractId: string } =>
  !!data.contractId && data.isChat === "true";
