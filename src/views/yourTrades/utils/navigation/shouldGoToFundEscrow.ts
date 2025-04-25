const statusThatLeadToFundEscrow = [
  "fundEscrow",
  "escrowWaitingForConfirmation",
];

export const shouldGoToFundEscrow = (status: TradeStatus) =>
  statusThatLeadToFundEscrow.includes(status);
