import { isBuyOffer } from '../isBuyOffer'
import { isKYCRequired } from './isKYCRequired'

export const isPaymentRequired = (offer: BuyOffer, contract: Contract) =>
  isBuyOffer(offer) && !isKYCRequired(offer, contract) && contract.paymentMade === null
