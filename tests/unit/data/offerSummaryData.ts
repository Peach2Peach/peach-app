import { OfferSummary } from "../../../peach-api/src/@types/offer";

export const offerSummary: OfferSummary = {
  id: "456",
  type: "bid",
  matches: [],
  tradeRequests: [],
  creationDate: new Date("2021-01-01"),
  lastModified: new Date("2021-01-01"),
  tradeStatus: "searchingForPeer",
  amount: 21000,
};

export const canceledOfferSummary: OfferSummary = {
  id: "789",
  type: "ask",
  matches: [],
  tradeRequests: [],
  creationDate: new Date("2021-01-01"),
  lastModified: new Date("2021-01-01"),
  tradeStatus: "offerCanceled",
  amount: 21000,
  fundingTxId: "123",
};
