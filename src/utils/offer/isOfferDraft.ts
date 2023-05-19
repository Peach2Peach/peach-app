export const isOfferDraft = (
  offer: BuyOffer | SellOffer | BuyOfferDraft | SellOfferDraft,
): offer is BuyOfferDraft | SellOfferDraft => !('id' in offer && offer.id)
