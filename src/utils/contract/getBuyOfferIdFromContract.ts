export const getBuyOfferIdFromContract = (contract: Contract | ContractSummary) => contract.id.split('-')[1]
