import { offersStorage } from '../../storage'

export const loadOffer = async (id: Offer['id']): Promise<BuyOffer | SellOffer | null> => offersStorage.getMap(id)
