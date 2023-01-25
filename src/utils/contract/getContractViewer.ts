export const getContractViewer = (contract: Contract, account: Account) =>
  account.publicKey === contract.seller.id ? 'seller' : 'buyer'
