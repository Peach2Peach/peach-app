import { isBuyOffer } from '../isBuyOffer'
import { isSellOffer } from '../isSellOffer'

export const isRatingRequired = (offer: SellOffer | BuyOffer, contract: Contract) =>
  !contract.canceled && ((isBuyOffer(offer) && !contract.ratingSeller) || (isSellOffer(offer) && !contract.ratingBuyer))
