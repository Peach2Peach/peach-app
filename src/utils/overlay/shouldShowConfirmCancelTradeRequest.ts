export const shouldShowConfirmCancelTradeRequest = (contract: Contract, view: ContractViewer) =>
  contract.cancelationRequested
  && view === 'buyer'
  && !contract.disputeActive
  && !contract.paymentConfirmed
  && !contract.releaseTxId
