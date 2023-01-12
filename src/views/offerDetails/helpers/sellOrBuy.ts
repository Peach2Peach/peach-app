import { isSellOffer } from '../../../utils/offer'

export const sellOrBuy = (offer: SellOffer | BuyOffer) => (isSellOffer(offer) ? 'sell' : 'buy')
