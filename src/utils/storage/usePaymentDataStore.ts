import create from 'zustand'
import { paymentDataStorage } from './paymentDataStorage'

export type PaymentDataStorage = {
  paymentData: Record<PaymentData['id'], PaymentData>
  setPaymentData: (paymentData: PaymentData) => void
  get: (id: PaymentData['id']) => PaymentData
  iterator: () => PaymentData[]
  initialize: () => Promise<unknown>
}

export const usePaymentDataStore = create<PaymentDataStorage>()((set, get) => ({
  paymentData: {},
  initialize: async () => {
    const initialPaymentData = (await paymentDataStorage.indexer.maps.getAll()) as Account['paymentData']
    set((state) => ({ ...state, paymentData: initialPaymentData }))
  },
  setPaymentData: (paymentData: PaymentData) =>
    set((state) => {
      paymentDataStorage.setMap(paymentData.id, paymentData)
      return { ...state, [paymentData.id]: paymentData }
    }),
  iterator: () => Object.values(get().paymentData),
  get: (id: PaymentData['id']) => get().paymentData[id],
}))
