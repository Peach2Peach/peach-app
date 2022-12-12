export const requiresDisputeResultAcknowledgement = (contract: Contract) =>
  contract.disputeWinner && !contract.disputeResultAcknowledged
