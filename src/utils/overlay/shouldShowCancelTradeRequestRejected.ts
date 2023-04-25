export const shouldShowCancelTradeRequestRejected = (contract: LocalContract, view: ContractViewer) =>
  !contract.canceled
  && view === 'seller'
  && !contract.paymentConfirmed
  && !contract.cancelationRequested
  && contract.cancelConfirmationPending
  && !contract.cancelConfirmationDismissed
