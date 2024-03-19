import { ContractSummary } from "../../../peach-api/src/@types/contract";

export const contractSummary: ContractSummary = {
  id: "123-456",
  offerId: "offerId",
  type: "bid",
  escrowType: "bitcoin",
  creationDate: new Date("2021-01-01"),
  lastModified: new Date("2021-01-01"),
  tradeStatus: "dispute",
  amount: 21000,
  price: 21,
  currency: "EUR",
  unreadMessages: 0,
  isChatActive: false,
  disputeOutcomeAcknowledged: false,
};
