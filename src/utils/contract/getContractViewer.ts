export const getContractViewer = (contract: Contract, account: Account): ContractViewer =>
  account.publicKey === contract.seller.id ? 'seller' : 'buyer'
