export const shouldShowTradeCanceled = (
  contract: Pick<Contract, 'canceled' | 'cancelConfirmationDismissed' | 'paymentConfirmed' | 'disputeWinner'>,
  view: ContractViewer,
) =>
  contract.canceled
  && view === 'seller'
  && !contract.cancelConfirmationDismissed
  && !contract.paymentConfirmed
  && contract.disputeWinner !== 'seller'
