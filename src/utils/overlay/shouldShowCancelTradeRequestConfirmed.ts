export const shouldShowCancelTradeRequestConfirmed = (contract: Contract, view: ContractViewer) =>
  contract.canceled
  && view === 'seller'
  && !contract.paymentConfirmed
  && !contract.cancelationRequested
  && contract.cancelConfirmationPending
  && !contract.cancelConfirmationDismissed
