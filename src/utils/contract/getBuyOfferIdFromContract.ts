export const getBuyOfferIdFromContract = (contract: Pick<Contract | ContractSummary, 'id'>) => contract.id.split('-')[1]
