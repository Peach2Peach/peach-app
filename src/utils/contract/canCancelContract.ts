export const canCancelContract = (contract: Contract, view: ContractViewer) =>
  !contract.disputeActive &&
  !contract.paymentMade &&
  !contract.canceled &&
  !contract.cancelationRequested &&
  !(
    view === "seller" &&
    (contract.paymentExpectedBy?.getTime() || 0) < Date.now()
  );
