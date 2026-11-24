import { PEACH_ID_LENGTH } from "./PEACH_ID_LENGTH";

/** must match the sentence the server builds for /instantTradeSignature */
export const getInstantTradeDeclarationMessage = (
  userId: string,
  offerId: string,
  isInstantTrade: boolean,
) =>
  `I, user peach${userId.substring(0, PEACH_ID_LENGTH)}, declare that the offer with id ${offerId} ${isInstantTrade ? "is" : "is NOT"} instant trade`;
