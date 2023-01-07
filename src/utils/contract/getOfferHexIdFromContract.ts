import { account } from '../account'
import { offerIdToHex } from '../offer'

export const getOfferHexIdFromContract = (contract: Contract) => {
  const offerId = contract.id.split('-')[account.publicKey === contract.seller.id ? 0 : 1]
  return offerIdToHex(offerId)
}
