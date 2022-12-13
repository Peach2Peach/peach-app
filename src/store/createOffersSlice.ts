import { StateCreator } from 'zustand'
import { UserDataStore } from '.'
import { offersStorage } from '../utils/storage/offersStorage'

export type OffersStore = {
  offers: Record<Offer['id'], BuyOffer | SellOffer>
  setOffer: (offer: BuyOffer | SellOffer) => void
  getOfferById: (id: Offer['id']) => BuyOffer | SellOffer
  getOfferArray: () => (BuyOffer | SellOffer)[]
  initializeOffers: () => Promise<unknown>
}

export const createOffersSlice: StateCreator<UserDataStore, [], [['zustand/persist', OffersStore]], OffersStore> = (
  set,
  get,
) => ({
  offers: {},
  initializeOffers: async () => {
    const initialOfferData = (await offersStorage.indexer.maps.getAll()) as Record<string, BuyOffer | SellOffer>
    set((state) => ({ ...state, offers: initialOfferData }))
  },
  setOffer: (offer: BuyOffer | SellOffer) =>
    set((state) => {
      offersStorage.setMap(offer.id!, offer)
      return { ...state, [offer.id!]: offer }
    }),
  getOfferArray: () => Object.values(get().offers),
  getOfferById: (id: Offer['id']) => get().offers[id],
})
