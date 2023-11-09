import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { getAvailableMethods } from '../../../utils/match'
import { createMatchSelectors, MatchSelectors } from './createMatchSelectors'
import { updateMatchSelectors } from './updateMatchSelectors'

type MatchState = {
  matchSelectors: MatchSelectors
  currentPage: number
}

export type MatchStore = MatchState & {
  setSelectedCurrency: (currency: Currency, matchId: Match['offerId']) => void
  setSelectedPaymentMethod: (paymentMethod: PaymentMethod | undefined, matchId: Match['offerId']) => void
  setCurrentPage: (currentPage: number) => void
  setAvailablePaymentMethods: (methods: PaymentMethod[], matchId: Match['offerId']) => void
  resetStore: () => void
  addMatchSelectors: (matches: Match[], offerMeansOfPayment: MeansOfPayment) => void
  setShowPaymentMethodPulse: (matchId: Match['offerId'], show?: boolean) => void
}

const defaultState: MatchState = {
  currentPage: 0,
  matchSelectors: {},
}

export const useMatchStore = create<MatchStore>()(
  immer((set, get) => ({
    ...defaultState,
    setSelectedCurrency: (currency, matchId) => {
      const currentMatch = get().matchSelectors[matchId]
      const currentPaymentMethod = currentMatch.selectedPaymentMethod
      const newMethods = getAvailableMethods(currentMatch.meansOfPayment, currency, currentMatch.mopsInCommon)
      get().setAvailablePaymentMethods(newMethods, matchId)
      if (newMethods.length === 1) {
        get().setSelectedPaymentMethod(newMethods[0], matchId)
      } else if (currentPaymentMethod && !newMethods.includes(currentPaymentMethod)) {
        get().setSelectedPaymentMethod(undefined, matchId)
      }
      return set((state) => {
        state.matchSelectors[matchId].selectedCurrency = currency
      })
    },
    setSelectedPaymentMethod: (paymentMethod, matchId) =>
      set((state) => {
        state.matchSelectors[matchId].showPaymentMethodPulse = false
        state.matchSelectors[matchId].selectedPaymentMethod = paymentMethod
      }),
    setCurrentPage: (currentPage) => set({ currentPage }),
    setAvailablePaymentMethods: (methods, matchId) =>
      set((state) => {
        state.matchSelectors[matchId].availablePaymentMethods = methods
      }),
    resetStore: () => set(defaultState),
    addMatchSelectors: (matches, offerMeansOfPayment) => {
      const newMatchSelectors = createMatchSelectors(matches, offerMeansOfPayment)
      const updatedMatchSelectors = updateMatchSelectors(get().matchSelectors, newMatchSelectors)

      return set({ matchSelectors: { ...newMatchSelectors, ...updatedMatchSelectors } })
    },
    setShowPaymentMethodPulse: (matchId, show = true) =>
      set((state) => {
        state.matchSelectors[matchId].showPaymentMethodPulse = show
      }),
  })),
)
