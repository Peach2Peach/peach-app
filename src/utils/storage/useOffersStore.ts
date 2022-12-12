import create from 'zustand'
import { offersStorage } from './offersStorage'

export type OffersStore = {
  offers: Record<Offer['id'], BuyOffer | SellOffer>
  setOffer: (offer: BuyOffer | SellOffer) => void
  get: (id: Offer['id']) => BuyOffer | SellOffer
  iterator: () => (BuyOffer | SellOffer)[]
  initialize: () => Promise<unknown>
}

export const useOffersStore = create<OffersStore>()((set, get) => ({
  offers: {},
  initialize: async () => {
    const initialOfferData = (await offersStorage.indexer.maps.getAll()) as Account['offers']
    set((state) => ({ ...state, offers: initialOfferData }))
  },
  setOffer: (offer: BuyOffer | SellOffer) =>
    set((state) => {
      offersStorage.setMap(offer.id!, offer)
      return { ...state, [offer.id!]: offer }
    }),
  iterator: () => Object.values(get().offers),
  get: (id: Offer['id']) => get().offers[id],
}))
