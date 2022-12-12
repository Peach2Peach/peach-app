import { info } from '../../log'
import { offersStorage } from '../../storage'

export const storeOffers = async (offers: Account['offers']) => {
  info('storeOffers - Storing offers', offers.length)

  await Promise.all(offers.map((offer) => offersStorage.setMapAsync(offer.id!, offer)))
}
