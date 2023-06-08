import { create } from 'zustand'
import { defaultFundingStatus } from '../utils/offer/constants'

const defaultBuyPreferences: BuyOfferDraft = {
  type: 'bid',
  amount: [0, Infinity],
  meansOfPayment: {},
  paymentData: {},
  releaseAddress: '',
  originalPaymentData: [],
}

const defaultSellPreferences: SellOfferDraft = {
  type: 'ask',
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
  buyPreferences: BuyOfferDraft
  sellPreferences: SellOfferDraft
}

type OfferPreferencesActions = {
  updateBuyPreferences: (newPreferences: Partial<BuyOfferDraft>) => void
  updateSellPreferences: (newPreferences: Partial<SellOfferDraft>) => void
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
