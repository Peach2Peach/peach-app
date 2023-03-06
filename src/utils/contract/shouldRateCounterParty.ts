export const shouldRateCounterParty = (contract: Contract, view: 'buyer' | 'seller') =>
  (view === 'buyer' && !contract.ratingSeller) || (view === 'seller' && !contract.ratingBuyer)
