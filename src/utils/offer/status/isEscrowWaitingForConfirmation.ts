import { isSellOffer } from '../isSellOffer'
import { isFunded } from './isFunded'
import { isFundingCanceled } from './isFundingCanceled'
import { isWronglyFunded } from './isWronglyFunded'

export const isEscrowWaitingForConfirmation = (offer: SellOffer) =>
  isSellOffer(offer) && offer.escrow && !isFunded(offer) && !isWronglyFunded(offer) && !isFundingCanceled(offer)
