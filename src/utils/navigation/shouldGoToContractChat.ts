export const shouldGoToContractChat = (
  data: PNData,
): data is PNData & { contractId: string } =>
  !!data.contractId && data.isChat === "true";
