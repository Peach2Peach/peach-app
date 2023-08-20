import { getOffer } from '../offer'
import { getSellOfferIdFromContract } from './getSellOfferIdFromContract'

export const getSellOfferFromContract = (contract: Pick<Contract, 'id'>): SellOffer =>
  getOffer(getSellOfferIdFromContract(contract)) as SellOffer
