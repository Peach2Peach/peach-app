export const shouldShowTradeCanceled = (contract: Contract, view: ContractViewer) =>
  contract.canceled && view === 'seller' && !contract.cancelConfirmationDismissed && !contract.paymentConfirmed
