export const canOpenDispute = (contract: Contract, view: 'seller' | 'buyer' | '') =>
  !!contract.symmetricKey
  && ((!contract.disputeActive && !/cash/u.test(contract.paymentMethod))
    || (view === 'seller' && contract.cancelationRequested))
