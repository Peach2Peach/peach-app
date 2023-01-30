export const canOpenDispute = (contract: Contract, view?: ContractViewer) =>
  !!contract.symmetricKey
  && ((!contract.disputeActive && !/cash/u.test(contract.paymentMethod))
    || (view === 'seller' && contract.cancelationRequested))
