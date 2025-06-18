export const chatKeys = {
  all: ["chats"] as const,
  contracts: () => [...chatKeys.all, "contracts"] as const,
  contract: (id: string) => [...chatKeys.contracts(), id] as const,
  tradeRequests: () => [...chatKeys.all, "tradeRequests"] as const,
  tradeRequest: (offerType: "buyOffer" | "sellOffer", chatRoomId: string) =>
    [...chatKeys.tradeRequests(), offerType, chatRoomId] as const,
  symmetricKeyEncrypted: (
    offerType: "buyOffer" | "sellOffer",
    chatRoomId: string,
  ) =>
    [
      ...chatKeys.tradeRequest(offerType, chatRoomId),
      "symmetricKeyEncrypted",
    ] as const,
  symmetricKey: (symmetricKeyEncrypted = "none") =>
    [chatKeys.all, "symmetricKey", symmetricKeyEncrypted] as const,
};
