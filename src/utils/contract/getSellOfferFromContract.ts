import { getOffer } from '../offer'
import { getSellOfferIdFromContract } from './getSellOfferIdFromContract'

export const getSellOfferFromContract = (contract: Contract): SellOffer =>
  getOffer(getSellOfferIdFromContract(contract)) as SellOffer
