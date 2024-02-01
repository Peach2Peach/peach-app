export const shouldGoToContract = (
  data: PNData,
): data is PNData & {
  contractId: string;
  sentTime: string | number | Date | undefined;
} => !!data.contractId && data.isChat !== "true";
