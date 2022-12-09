import { isSellOffer } from '../isSellOffer'

export const isEscrowWaitingForConfirmation = (offer: SellOffer) =>
  isSellOffer(offer)
  && offer.escrow
  && offer.funding.status !== 'FUNDED'
  && offer.funding.status !== 'WRONG_FUNDING_AMOUNT'
  && offer.funding.status !== 'CANCELED'
