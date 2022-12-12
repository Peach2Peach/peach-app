import create from 'zustand'
import { persist } from 'zustand/middleware'
import { createStorage } from './createStorage'

export const offerStorage = createStorage('offers')

type OfferStore = {
  offers: Record<Offer['id'], BuyOffer | SellOffer>
  setOffer: (offer: BuyOffer | SellOffer) => void
}

export const useOfferStore = create<OfferStore>()(
  persist(
    (set) => ({
      offers: {},
      setOffer: (offer: BuyOffer | SellOffer) => set((state) => ({ ...state, [offer.id!]: offer })),
    }),
    {
      name: 'offer-storage',
      version: 0,
      getStorage: () => offerStorage,
    },
  ),
)
