import { account } from '../account'
import { offerIdToHex } from '../offer'

/**
 * @description Method to retrieve offer id to hex
 * @param contract Contract
 * @returns hex representation of offer id
 */
export const getOfferIdfromContract = (contract: Contract) => { 
  return offerIdToHex(contract.id.split('-')[account.publicKey === contract.seller.id ? 0 : 1])
}