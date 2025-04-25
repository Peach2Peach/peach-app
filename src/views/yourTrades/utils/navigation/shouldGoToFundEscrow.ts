import { TradeStatus } from "../../../../../peach-api/src/@types/offer";

const statusThatLeadToFundEscrow = [
  "fundEscrow",
  "escrowWaitingForConfirmation",
];

export const shouldGoToFundEscrow = (status: TradeStatus) =>
  statusThatLeadToFundEscrow.includes(status);
