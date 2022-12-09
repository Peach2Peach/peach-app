import { isSellOffer } from '../isSellOffer'
import { isFundingCanceled } from './isFundingCanceled'
import { isWronglyFunded } from './isWronglyFunded'

export const isOfferCanceled = (offer: BuyOffer | SellOffer) =>
  (!offer.online && !offer.contractId) || (isSellOffer(offer) && (isWronglyFunded(offer) || isFundingCanceled(offer)))
