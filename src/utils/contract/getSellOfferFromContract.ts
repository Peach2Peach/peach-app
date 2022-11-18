import { getOffer } from '../offer'

/**
 * @description Method to get sell offer of contract
 * @param contract the contract
 * @returns sell offer
 */
export const getSellOfferFromContract = (contract: Contract): SellOffer =>
  getOffer(contract.id.split('-')[0]) as SellOffer
