import { info } from '../../log'
import { offerStorage } from '../accountStorage'

export const storeOffers = async (offers: Account['offers']) => {
  info('storeOffers - Storing offers', offers.length)

  await Promise.all(offers.filter(({ id }) => id).map((offer) => offerStorage.setMapAsync(offer.id!, offer)))
}
