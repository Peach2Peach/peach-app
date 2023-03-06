import { getOffer } from '../offer'
import { getBuyOfferIdFromContract } from './getBuyOfferIdFromContract'

export const getBuyOfferFromContract = (contract: Contract): BuyOffer =>
  getOffer(getBuyOfferIdFromContract(contract)) as BuyOffer
