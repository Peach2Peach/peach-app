import { error } from '../../log'
import { offerStorage } from '../accountStorage'

export const loadOffers = async (): Promise<Account['offers']> => {
  const offers = await offerStorage.indexer.maps.getAll()

  if (offers) return offers as Account['offers']

  error('Could not load offers')
  return []
}
