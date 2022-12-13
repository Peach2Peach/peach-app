import { error } from '../../log'
import { offersStorage } from '../../storage'

export const loadOffers = async (): Promise<Record<string, BuyOffer | SellOffer>> => {
  const offers = await offersStorage.indexer.maps.getAll()

  if (offers) return offers as Record<string, BuyOffer | SellOffer>

  error('Could not load offers')
  return {}
}
