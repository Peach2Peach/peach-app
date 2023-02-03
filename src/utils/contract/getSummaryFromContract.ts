import { account } from './../account/account'
export const getSummaryFromContract = (contract: Contract) => {
  const summary: ContractSummary = {
    ...contract,
    offerId: contract.id,
    type: account.publicKey === contract.seller.id ? 'ask' : 'bid',
  }
  return summary
}
