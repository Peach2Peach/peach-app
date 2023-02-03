import { account } from './../account/account'
export const getSummaryFromContract = (contract: Contract) => {
  const summary: ContractSummary = {
    ...contract,
    offerId: contract.id,
    type: account.publicKey === contract.seller.id ? 'ask' : 'bid',
    creationDate: new Date(contract.creationDate),
    paymentMade: contract.paymentMade ? new Date(contract.paymentMade) : undefined,
    lastModified: new Date(contract.lastModified),
  }
  return summary
}
