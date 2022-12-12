import { error } from '../../log'
import { offersStorage } from '../../storage'

export const loadOffers = async (): Promise<Account['offers']> => {
  const offers = await offersStorage.indexer.maps.getAll()

  if (offers) return Object.values(offers) as Account['offers']

  error('Could not load offers')
  return []
}
