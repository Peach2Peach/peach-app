import { SellOfferSummary } from "../../../peach-api/src/@types/offer";

export const canceledOfferSummary: SellOfferSummary = {
  id: "789",
  type: "ask",
  matches: [],
  creationDate: new Date("2021-01-01"),
  lastModified: new Date("2021-01-01"),
  tradeStatus: "offerCanceled",
  amount: 21000,
  fundingTxId: "123",
  escrowType: "bitcoin",
  premium: 1.5,
  refunded: false,
};
