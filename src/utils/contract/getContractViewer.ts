export const getContractViewer = (
  sellerId: string,
  { publicKey }: Pick<Account, "publicKey">,
): ContractViewer => (publicKey === sellerId ? "seller" : "buyer");
