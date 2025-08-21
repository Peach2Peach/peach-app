export const canCancelContract = (contract: Contract, view: ContractViewer) => {
  if (
    [
      "createEscrow",
      "waitingForFunding",
      "fundEscrow",
      "escrowWaitingForConfirmation",
      "fundingExpired",
    ].includes(contract.tradeStatus)
  ) {
    return false;
  }

  return (
    !contract.disputeActive &&
    !contract.paymentMade &&
    !contract.canceled &&
    !contract.cancelationRequested &&
    !(
      view === "seller" &&
      (contract.paymentExpectedBy?.getTime() || 0) < Date.now()
    )
  );
};
