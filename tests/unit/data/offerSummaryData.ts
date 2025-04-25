import {
  BuyOfferSummary,
  SellOfferSummary,
} from "../../../peach-api/src/@types/offer";

export const buyOfferSummary: BuyOfferSummary = {
  id: "456",
  type: "bid",
  matches: [],
  creationDate: new Date("2021-01-01"),
  lastModified: new Date("2021-01-01"),
  tradeStatus: "searchingForPeer",
  amount: [21000, 22000],
  escrowType: "bitcoin",
};

export const sellOfferSummary: SellOfferSummary = {
  id: "123",
  type: "ask",
  matches: [],
  creationDate: new Date("2021-01-01"),
  lastModified: new Date("2021-01-01"),
  tradeStatus: "searchingForPeer",
  amount: 21000,
  fundingTxId: "123",
  escrowType: "bitcoin",
  premium: 1.5,
  refunded: false,
};

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
