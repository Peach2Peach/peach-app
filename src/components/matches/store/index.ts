import create from 'zustand'
import { getAvailableMethods } from '../../../utils/match'
import { immer } from 'zustand/middleware/immer'
import { createMatchSelectors, MatchSelectors } from './createMatchSelectors'
import { updateMatchSelectors } from './updateMatchSelectors'

type MatchState = {
  matchSelectors: MatchSelectors
  currentIndex: number
  currentPage: number
  offerMeansOfPayment: MeansOfPayment
}

export type MatchStore = MatchState & {
  setSelectedCurrency: (currency: Currency, matchId: Match['offerId']) => void
  setSelectedPaymentMethod: (paymentMethod: PaymentMethod, matchId: Match['offerId']) => void
  setCurrentIndex: (newIndex: number) => void
  setAvailablePaymentMethods: (methods: PaymentMethod[], matchId: Match['offerId']) => void
  setOfferMeansOfPayment: (offerMeansOfPayment: MeansOfPayment) => void
  resetStore: () => void
  addMatchSelectors: (matches: Match[], offerMeansOfPayment: MeansOfPayment) => void
}

const defaultState: MatchState = {
  currentIndex: 0,
  currentPage: 0,
  matchSelectors: {},
  offerMeansOfPayment: {},
}

export const useMatchStore = create<MatchStore>()(
  immer((set, get) => ({
    ...defaultState,
    setSelectedCurrency: (currency, matchId) => {
      const currentMatch = get().matchSelectors[matchId]
      const newMethods = getAvailableMethods(currentMatch.meansOfPayment, currency, currentMatch.mopsInCommon)
      get().setAvailablePaymentMethods(newMethods, matchId)
      if (!newMethods.includes(currentMatch.selectedCurrency)) {
        get().setSelectedPaymentMethod(newMethods[0], matchId)
      }
      return set((state) => {
        state.matchSelectors[matchId].selectedCurrency = currency
      })
    },
    setSelectedPaymentMethod: (paymentMethod, matchId) =>
      set((state) => {
        state.matchSelectors[matchId].selectedPaymentMethod = paymentMethod
      }),
    setCurrentIndex: (newIndex) =>
      set((state) => ({ ...state, currentIndex: newIndex, currentPage: Math.floor(newIndex / 10) })),
    setOfferMeansOfPayment: (offerMeansOfPayment) => set((state) => ({ ...state, offerMeansOfPayment })),
    setAvailablePaymentMethods: (methods, matchId) =>
      set((state) => {
        state.matchSelectors[matchId].availablePaymentMethods = methods
      }),
    resetStore: () => set(() => defaultState),
    addMatchSelectors: (matches, offerMeansOfPayment) => {
      const newMatchSelectors = createMatchSelectors(matches, offerMeansOfPayment)
      const updatedMatchSelectors = updateMatchSelectors(get().matchSelectors, newMatchSelectors)

      return set((state) => ({
        ...state,
        matchSelectors: { ...newMatchSelectors, ...updatedMatchSelectors },
        offerMeansOfPayment,
      }))
    },
  })),
)
