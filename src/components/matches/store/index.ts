import create from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { getAvailableMethods } from '../../../utils/match'
import { createMatchSelectors, MatchSelectors } from './createMatchSelectors'
import { updateMatchSelectors } from './updateMatchSelectors'

type MatchState = {
  offer: BuyOffer | SellOffer
  matchSelectors: MatchSelectors
  currentIndex: number
  currentPage: number
}

export type MatchStore = MatchState & {
  setOffer: (offer: BuyOffer | SellOffer) => void
  setSelectedCurrency: (currency: Currency, matchId: Match['offerId']) => void
  setSelectedPaymentMethod: (paymentMethod: PaymentMethod | undefined, matchId: Match['offerId']) => void
  setCurrentIndex: (newIndex: number) => void
  setAvailablePaymentMethods: (methods: PaymentMethod[], matchId: Match['offerId']) => void
  resetStore: () => void
  addMatchSelectors: (matches: Match[], offerMeansOfPayment: MeansOfPayment) => void
  setShowCurrencyPulse: (matchId: Match['offerId'], show?: boolean) => void
  setShowPaymentMethodPulse: (matchId: Match['offerId'], show?: boolean) => void
}

const defaultBuyOffer: BuyOffer = {
  online: false,
  type: 'bid',
  creationDate: new Date(),
  meansOfPayment: {},
  paymentData: {},
  originalPaymentData: [],
  kyc: false,
  amount: [200000, 1000000],
  matches: [],
  seenMatches: [],
  matched: [],
  doubleMatched: false,
  releaseAddress: '',
  id: '0',
  tradeStatus: 'waiting', // TODO: decide on a default here
  message: '', // TODO: decide on a default here
}

const defaultState: MatchState = {
  offer: defaultBuyOffer,
  currentIndex: 0,
  currentPage: 0,
  matchSelectors: {},
}

export const useMatchStore = create<MatchStore>()(
  immer((set, get) => ({
    ...defaultState,
    setOffer: (offer) => set((state) => ({ ...state, offer })),
    setSelectedCurrency: (currency, matchId) => {
      const currentMatch = get().matchSelectors[matchId]
      const currentPaymentMethod = currentMatch.selectedPaymentMethod
      const newMethods = getAvailableMethods(currentMatch.meansOfPayment, currency, currentMatch.mopsInCommon)
      get().setAvailablePaymentMethods(newMethods, matchId)
      if (currentPaymentMethod && !newMethods.includes(currentPaymentMethod)) {
        get().setSelectedPaymentMethod(undefined, matchId)
      }
      return set((state) => {
        state.matchSelectors[matchId].showCurrencyPulse = false
        state.matchSelectors[matchId].selectedCurrency = currency
      })
    },
    setSelectedPaymentMethod: (paymentMethod, matchId) =>
      set((state) => {
        state.matchSelectors[matchId].showPaymentMethodPulse = false
        state.matchSelectors[matchId].selectedPaymentMethod = paymentMethod
      }),
    setCurrentIndex: (newIndex) =>
      set((state) => ({ ...state, currentIndex: newIndex, currentPage: Math.floor(newIndex / 10) })),
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
      }))
    },
    setShowCurrencyPulse: (matchId, show = true) =>
      set((state) => {
        state.matchSelectors[matchId].showCurrencyPulse = show
      }),
    setShowPaymentMethodPulse: (matchId, show = true) =>
      set((state) => {
        state.matchSelectors[matchId].showPaymentMethodPulse = show
      }),
  })),
)
