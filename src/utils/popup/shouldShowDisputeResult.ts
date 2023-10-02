export const shouldShowDisputeResult = (
  contract: Pick<Contract, 'disputeActive' | 'disputeResolvedDate' | 'disputeResultAcknowledged'>,
) => !contract.disputeActive && !!contract.disputeResolvedDate && !contract.disputeResultAcknowledged
