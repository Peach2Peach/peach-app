import create, { createStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { createStorage, toZustandStorage } from '../utils/storage'

export type TradeSummaryState = {
  offers: OfferSummary[]
  contracts: ContractSummary[]
}

type TradeSummaryStore = TradeSummaryState & {
  setOffers: (offers: OfferSummary[]) => void
  setOffer: (offerId: string, data: Partial<OfferSummary>) => void
  setContracts: (contracts: ContractSummary[]) => void
  getOffer: (offerId: string) => OfferSummary | undefined
}

const defaultState: TradeSummaryState = {
  offers: [],
  contracts: [],
}
export const tradeSummaryStorage = createStorage('tradeSummary')

export const tradeSummaryStore = createStore(
  persist<TradeSummaryStore>(
    (set, get) => ({
      ...defaultState,
      setOffers: (offers) => set((state) => ({ ...state, offers })),
      setOffer: (offerId, data) => {
        const offers = get().offers.map((offer) => {
          if (offer.id === offerId) offer = {
            ...offer,
            ...data,
          }
          return offer
        })

        return set((state) => ({ ...state, offers }))
      },
      getOffer: (offerId) => get().offers.find(({ id }) => id === offerId),
      setContracts: (contracts) => set((state) => ({ ...state, contracts })),
    }),
    {
      name: 'tradeSummary',
      version: 0,
      getStorage: () => toZustandStorage(tradeSummaryStorage),
    },
  ),
)

export const useTradeSummaryStore = create(tradeSummaryStore)
