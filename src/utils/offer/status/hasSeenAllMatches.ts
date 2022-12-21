import { diff } from '../../array'

export const hasSeenAllMatches = (offer: BuyOffer | SellOffer) => diff(offer.matches, offer.seenMatches).length === 0
