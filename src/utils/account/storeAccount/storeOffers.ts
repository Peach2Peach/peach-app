import { info } from '../../log'
import { offerStorage } from '../accountStorage'

export const storeOffers = async (offers: Account['offers']) => {
  info('Storing offers', offers.length)

  await Promise.all(offers.map((offer) => offerStorage.setMapAsync(`offer-${offer.id}`, offer)))
}
