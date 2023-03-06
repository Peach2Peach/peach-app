export const canCancelContract = (contract: Contract) =>
  !contract.disputeActive && !contract.paymentMade && !contract.canceled && !contract.cancelationRequested
