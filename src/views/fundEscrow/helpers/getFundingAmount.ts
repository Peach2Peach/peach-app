export const getFundingAmount = (offerIds?: string[], amount = 0) =>
  offerIds ? amount * offerIds.length : amount;
