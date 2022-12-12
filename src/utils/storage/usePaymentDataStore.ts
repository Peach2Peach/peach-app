import create from 'zustand'
import { persist } from 'zustand/middleware'
import { omit } from '../object'
import { paymentDataStorage } from './paymentDataStorage'

type PaymentDataStore = {
  data: Record<PaymentData['id'], PaymentData>
  get: (id: PaymentData['id']) => PaymentData
  iterator: () => PaymentData[]
  setPaymentData: (paymentData: PaymentData) => void
  removePaymentData: (id: PaymentData['id']) => void
}

export const usePaymentDataStore = create<PaymentDataStore>()(
  persist(
    (set, get) => ({
      data: {},
      iterator: () => Object.values(get().data),
      setPaymentData: (paymentData: PaymentData) =>
        set((state) => ({
          ...state,
          data: {
            ...state.data,
            [paymentData.id]: paymentData,
          },
        })),
      removePaymentData: (id: PaymentData['id']) =>
        set((state) => ({
          ...state,
          data: omit(state.data, id),
        })),
      get: (id: PaymentData['id']) => get().data[id],
    }),
    {
      name: 'paymentData-storage',
      version: 0,
      getStorage: () => paymentDataStorage,
    },
  ),
)
