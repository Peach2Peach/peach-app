import create from 'zustand'
import { offersStorage } from './offersStorage'

export type OffersStore = {
  offers: Record<Offer['id'], BuyOffer | SellOffer>
  setOffer: (offer: BuyOffer | SellOffer) => void
  get: (id: Offer['id']) => BuyOffer | SellOffer
  iterator: () => (BuyOffer | SellOffer)[]
}

export const useOffersStore = create<OffersStore>()((set, get) => ({
  offers: {},
  setOffer: (offer: BuyOffer | SellOffer) =>
    set((state) => {
      offersStorage.setMap(offer.id!, offer)
      return { ...state, [offer.id!]: offer }
    }),
  iterator: () => Object.values(get().offers),
  get: (id: Offer['id']) => get().offers[id],
}))
