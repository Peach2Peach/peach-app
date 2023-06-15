import { error, info } from '../../log'
import { offerStorage } from '../offerStorage'

export const storeOffer = (offer: SellOffer | BuyOffer) => {
  if (!offer.id) {
    error('storeOffer - No offer id defined')
    return
  }
  info('storeOffer - Storing offer')

  offerStorage.setMap(offer.id, offer)
}
