/**
 * @description The single-sig escrow release added server errors that are plain
 * English sentences instead of error codes. Map them onto keys the app can
 * translate, so the user gets a proper message instead of the raw sentence.
 */
const SERVER_ERROR_MESSAGES: Record<string, string> = {
  "please update the app to the latest version": "APP_UPDATE_REQUIRED",
  "you are not allowed to sell": "SELLING_NOT_ALLOWED",
  "you already have an ongoing trade": "ONGOING_TRADE_EXISTS",
  "the seller already has an ongoing trade": "SELLER_HAS_ONGOING_TRADE",
  "you are not able to republish. please refund": "REPUBLISH_NOT_POSSIBLE",
  "this sell offer can no longer be traded": "SELL_OFFER_NOT_TRADEABLE",
  "this escrow can only be refunded by the seller": "REFUND_ONLY_BY_SELLER",
};

export const getServerErrorMessageKey = (message: string) =>
  SERVER_ERROR_MESSAGES[message.trim().toLowerCase()];
