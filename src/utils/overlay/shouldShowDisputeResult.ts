export const shouldShowDisputeResult = (contract: LocalContract) =>
  !contract.disputeActive && !!contract.disputeResolvedDate && !contract.disputeResultAcknowledged
