import { offerStorage } from '../offerStorage'

export const loadOffer = (id: Offer['id']) => offerStorage.getMap(id)
