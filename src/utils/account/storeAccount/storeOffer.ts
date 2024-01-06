import { error } from '../../log/error'
import { info } from '../../log/info'
import { offerStorage } from '../offerStorage'

export const storeOffer = (offer: SellOffer | BuyOffer) => {
  if (!offer.id) {
    error('storeOffer - No offer id defined')
    return
  }
  info('storeOffer - Storing offer')

  offerStorage.setMap(offer.id, offer)
}
