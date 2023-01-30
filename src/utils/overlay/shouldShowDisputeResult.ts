export const shouldShowDisputeResult = (contract: Contract) =>
  !contract.disputeActive && !!contract.disputeResolvedDate && !contract.disputeResultAcknowledged
