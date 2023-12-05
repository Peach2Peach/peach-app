import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getSelectedPaymentDataIds } from '../../utils/account'
import { createStorage } from '../../utils/storage'
import { createPersistStorage } from '../createPersistStorage'
import {
  getHashedPaymentData,
  getMeansOfPayment,
  getOriginalPaymentData,
  getPreferredMethods,
  validatePaymentMethods,
} from './helpers'
import { CurrencyType } from './types'

export type OfferPreferences = {
  buyAmountRange: [number, number]
  sellAmount: number
  premium: number
  meansOfPayment: MeansOfPayment
  paymentData: OfferPaymentData
  preferredPaymentMethods: Partial<Record<PaymentMethod, string>>
  originalPaymentData: PaymentData[]
  preferredCurrenyType: CurrencyType
  multi?: number
  sortBy: {
    buyOffer: BuySorter[]
    sellOffer: SellSorter[]
  }
  filter: {
    buyOffer: MatchFilter
  }
}

export const defaultPreferences: OfferPreferences = {
  buyAmountRange: [0, Infinity],
  sellAmount: 0,
  premium: 1.5,
  meansOfPayment: {},
  paymentData: {},
  preferredPaymentMethods: {},
  originalPaymentData: [],
  multi: undefined,
  preferredCurrenyType: 'europe',
  sortBy: {
    buyOffer: ['bestReputation'],
    sellOffer: ['bestReputation'],
  },
  filter: {
    buyOffer: {
      maxPremium: null,
    },
  },
}

type OfferPreferencesState = OfferPreferences & {
  canContinue: {
    buyAmountRange: boolean
    premium: boolean
    paymentMethods: boolean
  }
}

type OfferPreferencesActions = {
  setBuyAmountRange: (buyAmountRange: [number, number], rangeRestrictions: { min: number; max: number }) => void
  setSellAmount: (sellAmount: number) => void
  setMulti: (number?: number) => void
  setPremium: (newPremium: number, isValid?: boolean) => void
  setPaymentMethods: (ids: string[]) => void
  selectPaymentMethod: (id: string) => void
  setPreferredCurrencyType: (preferredCurrenyType: CurrencyType) => void
  setBuyOfferSorter: (sorter: BuySorter) => void
  setSellOfferSorter: (sorter: SellSorter) => void
  setBuyOfferFilter: (filter: MatchFilter) => void
}

type OfferPreferencesStore = OfferPreferencesState & OfferPreferencesActions

const offerPreferences = createStorage('offerPreferences')
const storage = createPersistStorage(offerPreferences)

export const useOfferPreferences = create<OfferPreferencesStore>()(
  persist(
    // eslint-disable-next-line max-lines-per-function
    (set, get) => ({
      ...defaultPreferences,
      canContinue: {
        buyAmountRange: false,
        sellAmount: false,
        premium: false,
        paymentMethods: false,
      },
      setBuyAmountRange: (buyAmountRange, rangeRestrictions) => {
        const [minBuyAmount, maxBuyAmount] = buyAmountRange
        set((state) => ({
          buyAmountRange,
          canContinue: {
            ...state.canContinue,
            buyAmountRange:
              minBuyAmount >= rangeRestrictions.min
              && maxBuyAmount <= rangeRestrictions.max
              && minBuyAmount <= maxBuyAmount,
          },
        }))
      },
      setSellAmount: (sellAmount) => set({ sellAmount }),
      setMulti: (multi) => set({ multi }),
      setPremium: (newPremium, isValid) => {
        set((state) => ({
          premium: newPremium,
          canContinue: {
            ...state.canContinue,
            premium: isValid ?? state.canContinue.premium,
          },
        }))
      },
      setPaymentMethods: (ids) => {
        const preferredPaymentMethods = getPreferredMethods(ids)
        const originalPaymentData = getOriginalPaymentData(preferredPaymentMethods)
        const meansOfPayment = getMeansOfPayment(originalPaymentData)
        const paymentData = getHashedPaymentData(originalPaymentData)

        const newPreferences = {
          preferredPaymentMethods,
          meansOfPayment,
          paymentData,
          originalPaymentData,
        }

        set((state) => ({
          ...newPreferences,
          canContinue: {
            ...state.canContinue,
            paymentMethods: validatePaymentMethods({ ...state, ...newPreferences }),
          },
        }))
      },
      selectPaymentMethod: (id: string) => {
        const selectedPaymentDataIds = getSelectedPaymentDataIds(get().preferredPaymentMethods)
        if (selectedPaymentDataIds.includes(id)) {
          get().setPaymentMethods(selectedPaymentDataIds.filter((v) => v !== id))
        } else {
          get().setPaymentMethods([...selectedPaymentDataIds, id])
        }
      },
      setPreferredCurrencyType: (preferredCurrenyType) => set({ preferredCurrenyType }),
      setBuyOfferSorter: (sorter) => set((state) => ({ sortBy: { ...state.sortBy, buyOffer: [sorter] } })),
      setSellOfferSorter: (sorter) => set((state) => ({ sortBy: { ...state.sortBy, sellOffer: [sorter] } })),
      setBuyOfferFilter: (filter) => set((state) => ({ filter: { ...state.filter, buyOffer: filter } })),
    }),
    {
      name: 'offerPreferences',
      version: 0,
      storage,
    },
  ),
)
