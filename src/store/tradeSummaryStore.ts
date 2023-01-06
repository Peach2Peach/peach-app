import create, { createStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { createStorage, toZustandStorage } from '../utils/storage'

export type TradeSummaryState = {
  offers: OfferSummary[]
  contracts: ContractSummary[]
}

type TradeSummaryStore = TradeSummaryState & {
  setOffers: (offers: OfferSummary[]) => void
  setContracts: (contracts: ContractSummary[]) => void
}

const defaultState: TradeSummaryState = {
  offers: [],
  contracts: [],
}
export const tradeSummaryStorage = createStorage('tradeSummary')

export const tradeSummaryStore = createStore(
  persist<TradeSummaryStore>(
    (set) => ({
      ...defaultState,
      setOffers: (offers) => set((state) => ({ ...state, offers })),
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
