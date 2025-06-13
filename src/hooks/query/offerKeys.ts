export const offerKeys = {
  all: ["offers"] as const,
  single: ["offer"] as const,
  summaries: () => [...offerKeys.all, "summaries"] as const,
  summary: (id: string) => [...offerKeys.summaries(), id] as const,
  offer: (id: string) => [...offerKeys.single, id] as const,
  tradeRequest: (id: string) =>
    [...offerKeys.offer(id), "tradeRequest"] as const,
  details: () => [...offerKeys.all, "details"] as const,
  detail: (id: string) => [...offerKeys.details(), id] as const,
  escrowInfo: (id: string) => [...offerKeys.detail(id), "escrowInfo"] as const,
  fundingStatus: (id: string) =>
    [...offerKeys.detail(id), "fundingStatus"] as const,
};

export const tradeRequestKeys = {
  all: ["tradeRequests"] as const,
  single: ["tradeRequest"] as const,
  tradeRequest: (id: string) => [...tradeRequestKeys.single, id] as const,
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

export const matchChatKeys = {
  all: ["matchChats"] as const,
  single: ["matchChat"] as const,
  matchChat: (id: string) => [...matchChatKeys.single, id] as const,
  details: () => [...matchChatKeys.all, "details"] as const,
  isAllowedToChat: (offerId: string, matchingOfferId: string) =>
    [
      ...matchChatKeys.detail(offerId, matchingOfferId),
      "isAllowedToChat",
    ] as const,
  detail: (offerId: string, matchingOfferId: string) =>
    [...matchChatKeys.details(), `${offerId}-${matchingOfferId}`] as const,
  decryptedData: (offerId: string, matchingOfferId: string) =>
    [
      ...matchChatKeys.detail(offerId, matchingOfferId),
      "decryptedData",
    ] as const,
  chat: (offerId: string, matchingOfferId: string) =>
    [...matchChatKeys.detail(offerId, matchingOfferId), "chat"] as const,
};
