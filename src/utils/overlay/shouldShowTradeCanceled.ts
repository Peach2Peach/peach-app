export const shouldShowTradeCanceled = (contract: LocalContract, view: ContractViewer) =>
  contract.canceled && view === 'seller' && !contract.cancelConfirmationDismissed && !contract.paymentConfirmed
