import { isOfferDraft } from './isOfferDraft'

export const isPublishedOffer = (
  offer: BuyOffer | BuyOfferDraft | SellOffer | SellOfferDraft,
): offer is BuyOffer | SellOffer => !isOfferDraft(offer)
