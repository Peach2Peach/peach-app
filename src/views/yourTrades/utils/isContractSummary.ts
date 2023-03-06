export const isContractSummary = (trade: ContractSummary | OfferSummary): trade is ContractSummary =>
  'price' in trade && 'currency' in trade
