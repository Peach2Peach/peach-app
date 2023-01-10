import { account } from '../account'

export const getOfferIdFromContract = (contract: Contract) =>
  contract.id.split('-')[account.publicKey === contract.seller.id ? 0 : 1]
