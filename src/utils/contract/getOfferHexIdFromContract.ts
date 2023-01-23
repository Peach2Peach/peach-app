import { offerIdToHex } from '../offer'
import { getOfferIdFromContract } from './getOfferIdFromContract'

export const getOfferHexIdFromContract = (contract: Contract) => offerIdToHex(getOfferIdFromContract(contract))
