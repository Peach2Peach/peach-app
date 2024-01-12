import { info } from '../../log/info'
import { offerStorage } from '../offerStorage'

export const storeOffers = async (offers: Account['offers']) => {
  info('storeOffers - Storing offers', offers.length)

  await Promise.all(offers.filter(({ id }) => id).map((offer) => offerStorage.setMapAsync(offer.id, offer)))
}
