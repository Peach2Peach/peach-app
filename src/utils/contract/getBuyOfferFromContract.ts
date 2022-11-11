import { getOffer } from '../offer'

/**
 * @description Method to get buy offer of contract
 * @param contract the contract
 * @returns buy offer
 */
export const getBuyOfferFromContract = (contract: Contract): BuyOffer => getOffer(contract.id.split('-')[1]) as BuyOffer
