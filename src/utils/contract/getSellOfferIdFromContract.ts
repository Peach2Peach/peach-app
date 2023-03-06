export const getSellOfferIdFromContract = (contract: Contract | ContractSummary) => contract.id.split('-')[0]
