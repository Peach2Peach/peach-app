export const getSellOfferIdFromContract = ({ id }: Pick<Contract | ContractSummary, 'id'>) => id.split('-')[0]
