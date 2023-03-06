import { offerStorage } from '../offerStorage'

export const loadOffer = async (id: Offer['id']): Promise<BuyOffer | SellOffer | null> => offerStorage.getMap(id)
