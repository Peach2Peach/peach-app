export const shouldShowBuyerCanceledTrade = (contract: Contract, view: ContractViewer) =>
  contract.canceled && view === 'seller' && !contract.cancelConfirmationDismissed && !contract.paymentConfirmed
