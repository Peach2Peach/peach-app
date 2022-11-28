import create from 'zustand'

type MatchStore = {
  selectedCurrency: Currency
  selectedPaymentMethod: PaymentMethod
  currentIndex: number
  currentPage: number
  availableCurrencies: Currency[]
  availablePaymentMethods: PaymentMethod[]
  setSelectedCurrency: (currency: Currency) => void
  setSelectedPaymentMethod: (paymentMethod: PaymentMethod) => void
  setCurrentIndex: (mewIndex: number) => void
  setAvailableCurrencies: (currencies: Currency[]) => void
  setAvailablePaymentMethods: (methods: PaymentMethod[]) => void
}

export const useMatchStore = create<MatchStore>()((set) => ({
  selectedCurrency: 'EUR',
  selectedPaymentMethod: 'paypal',
  currentIndex: 0,
  currentPage: 0,
  availableCurrencies: [],
  availablePaymentMethods: [],
  setSelectedCurrency: (currency) => set((state) => ({ ...state, selectedCurrency: currency })),
  setSelectedPaymentMethod: (paymentMethod) => set((state) => ({ ...state, selectedPaymentMethod: paymentMethod })),
  setCurrentIndex: (newIndex) =>
    set((state) => ({ ...state, currentIndex: newIndex, currentPage: Math.floor(newIndex / 10) })),
  setAvailableCurrencies: (currencies: Currency[]) => set((state) => ({ ...state, availableCurrencies: currencies })),
  setAvailablePaymentMethods: (methods: PaymentMethod[]) =>
    set((state) => ({ ...state, availablePaymentMethods: methods })),
}))
