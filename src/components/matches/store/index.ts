import { getMatchCurrency } from './../../../utils/match/getMatchCurrency'
import create from 'zustand'
import { getAvailableCurrencies, getAvailableMethods, getMatchPaymentMethod } from '../../../utils/match'
import { getMoPsInCommon, hasMoPsInCommon } from '../../../utils/paymentMethod'

type MatchState = {
  selectedCurrency: Currency
  selectedPaymentMethod: PaymentMethod
  currentIndex: number
  currentPage: number
  availableCurrencies: Currency[]
  availablePaymentMethods: PaymentMethod[]
  mopsInCommon: Partial<Record<Currency, string[]>>
  offerMeansOfPayment: Partial<Record<Currency, string[]>>
  matchMeansOfPayment: Partial<Record<Currency, string[]>>
}

type MatchStore = MatchState & {
  setSelectedCurrency: (currency: Currency) => void
  setSelectedPaymentMethod: (paymentMethod: PaymentMethod) => void
  setCurrentIndex: (mewIndex: number) => void
  setAvailableCurrencies: (currencies: Currency[]) => void
  setAvailablePaymentMethods: (methods: PaymentMethod[]) => void
  setMopsInCommon: (mopsInCommon: Partial<Record<Currency, string[]>>) => void
  setOfferMeansOfPayment: (offerMeansOfPayment: Partial<Record<Currency, string[]>>) => void
  setMatchMeansOfPayment: (matchMeansOfPayment: Partial<Record<Currency, string[]>>) => void
}

const defaultState: MatchState = {
  selectedCurrency: 'EUR',
  selectedPaymentMethod: 'paypal',
  currentIndex: 0,
  currentPage: 0,
  availableCurrencies: [],
  availablePaymentMethods: [],
  mopsInCommon: {},
  offerMeansOfPayment: {},
  matchMeansOfPayment: {},
}

export const useMatchStore = create<MatchStore>()((set, get) => ({
  ...defaultState,
  setSelectedCurrency: (currency) => {
    get().setAvailablePaymentMethods(getAvailableMethods(get().matchMeansOfPayment, currency, get().mopsInCommon))
    return set((state) => ({ ...state, selectedCurrency: currency }))
  },
  setSelectedPaymentMethod: (paymentMethod) => {
    get().setAvailableCurrencies(
      getAvailableCurrencies(get().offerMeansOfPayment, get().matchMeansOfPayment, paymentMethod),
    )
    return set((state) => ({ ...state, selectedPaymentMethod: paymentMethod }))
  },
  setCurrentIndex: (newIndex) => {
    get().setSelectedCurrency(getMatchCurrency(get().offerMeansOfPayment, get().matchMeansOfPayment))
    get().setSelectedPaymentMethod(
      getMatchPaymentMethod(get().offerMeansOfPayment, get().matchMeansOfPayment) || defaultState.selectedPaymentMethod,
    )
    get().setMopsInCommon(
      hasMoPsInCommon(get().offerMeansOfPayment, get().matchMeansOfPayment)
        ? getMoPsInCommon(get().offerMeansOfPayment, get().matchMeansOfPayment)
        : get().matchMeansOfPayment,
    )

    return set((state) => ({ ...state, currentIndex: newIndex, currentPage: Math.floor(newIndex / 10) }))
  },
  setMopsInCommon: (mopsInCommon: Partial<Record<Currency, string[]>>) => set((state) => ({ ...state, mopsInCommon })),
  setOfferMeansOfPayment: (offerMeansOfPayment) => set((state) => ({ ...state, offerMeansOfPayment })),
  setMatchMeansOfPayment: (matchMeansOfPayment) => set((state) => ({ ...state, matchMeansOfPayment })),
  setAvailableCurrencies: (currencies) => set((state) => ({ ...state, availableCurrencies: currencies })),
  setAvailablePaymentMethods: (methods) => set((state) => ({ ...state, availablePaymentMethods: methods })),
}))
