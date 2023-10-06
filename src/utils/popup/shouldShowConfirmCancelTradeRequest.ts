export const shouldShowConfirmCancelTradeRequest = (
  { cancelationRequested, disputeActive, paymentConfirmed, releaseTxId }: Contract,
  view: ContractViewer,
) => cancelationRequested && view === 'buyer' && !disputeActive && !paymentConfirmed && !releaseTxId
