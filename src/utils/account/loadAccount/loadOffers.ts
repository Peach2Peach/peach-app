import { getIndexedMap } from '../../storage'
import { offerStorage } from '../offerStorage'

export const loadOffers = async () => {
  const offers = await getIndexedMap(offerStorage)

  return Object.values(offers) as Account['offers']
}
