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
  getOffer: (offerId: string) => OfferSummary | undefined
  setContracts: (contracts: ContractSummary[]) => void
  setContract: (contractId: string, data: Partial<ContractSummary>) => void
  getContract: (contractId: string) => ContractSummary | undefined
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
        let itemFound = false
        const offers = get().offers.map((offer) => {
          if (offer.id === offerId) {
            offer = {
              ...offer,
              ...data,
            }
            itemFound = true
          }
          return offer
        })

        if (!itemFound) {
          offers.push(data as OfferSummary)
        }

        return set((state) => ({ ...state, offers }))
      },
      getOffer: (offerId) => get().offers.find(({ id }) => id === offerId),
      setContracts: (contracts) => set((state) => ({ ...state, contracts })),
      setContract: (contractId, data) => {
        let itemFound = false
        const contracts = get().contracts.map((contract) => {
          if (contract.id === contractId) {
            contract = {
              ...contract,
              ...data,
            }
            itemFound = true
          }
          return contract
        })
        if (!itemFound) {
          contracts.push(data as ContractSummary)
        }

        return set((state) => ({ ...state, contracts }))
      },
      getContract: (contractId) => get().contracts.find(({ id }) => id === contractId),
    }),
    {
      name: 'tradeSummary',
      version: 0,
      getStorage: () => toZustandStorage(tradeSummaryStorage),
    },
  ),
)

export const useTradeSummaryStore = create(tradeSummaryStore)
