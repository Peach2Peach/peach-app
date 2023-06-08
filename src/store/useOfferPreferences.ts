import { create } from 'zustand'
import { defaultFundingStatus } from '../utils/offer/constants'

const defaultBuyPreferences = {
  type: 'bid',
  creationDate: undefined,
  lastModified: undefined,
  amount: [0, Infinity],
  meansOfPayment: {},
  paymentData: {},
  releaseAddress: '',
  originalPaymentData: [],
}

const defaultSellPreferences = {
  type: 'ask',
  creationDate: undefined,
  lastModified: undefined,
  tradeStatus: 'fundEscrow',
  premium: 1.5,
  meansOfPayment: {},
  paymentData: {},
  originalPaymentData: [],
  funding: defaultFundingStatus,
  amount: 0,
  returnAddress: '',
}

type OfferPreferences = {
  buyPreferences: typeof defaultBuyPreferences
  sellPreferences: typeof defaultSellPreferences
}

type OfferPreferencesActions = {
  updateBuyPreferences: (newPreferences: Partial<typeof defaultBuyPreferences>) => void
  updateSellPreferences: (newPreferences: Partial<typeof defaultSellPreferences>) => void
}

type OfferPreferencesState = OfferPreferences & OfferPreferencesActions

export const useOfferPreferences = create<OfferPreferencesState>()((set) => ({
  buyPreferences: defaultBuyPreferences,
  sellPreferences: defaultSellPreferences,
  updateBuyPreferences: (newPreferences) =>
    set((state) => ({
      buyPreferences: { ...state.buyPreferences, ...newPreferences },
    })),
  updateSellPreferences: (newPreferences) =>
    set((state) => ({
      sellPreferences: { ...state.sellPreferences, ...newPreferences },
    })),
}))
