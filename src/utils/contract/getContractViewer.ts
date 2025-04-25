export const getContractViewer = (
  sellerId: string,
  publicKey: string,
): ContractViewer => (publicKey === sellerId ? "seller" : "buyer");
