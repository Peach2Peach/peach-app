import { error, info } from '../../log'
import { offerStorage } from '../offerStorage'

export const storeOffer = async (offer: SellOffer | BuyOffer): Promise<void> => {
  if (!offer.id) {
    error('storeOffer - No offer id defined')
    return
  }
  info('storeOffer - Storing offer')

  offerStorage.setMap(offer.id, offer)
}
