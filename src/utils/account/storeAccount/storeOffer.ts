import { error, info } from '../../log'
import { offersStorage } from '../../storage'

export const storeOffer = async (offer: SellOffer | BuyOffer): Promise<void> => {
  if (!offer.id) {
    error('storeOffer - No offer id defined')
    return
  }
  info('storeOffer - Storing offer')

  offersStorage.setMap(offer.id, offer)
}
