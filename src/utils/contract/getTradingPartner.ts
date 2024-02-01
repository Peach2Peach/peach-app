export const getTradingPartner = (contract: Contract, account: Account) =>
  account.publicKey === contract.seller.id ? contract.buyer : contract.seller;
