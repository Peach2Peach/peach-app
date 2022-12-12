import create from 'zustand'
import { paymentDataStorage } from './paymentDataStorage'
import { immer } from 'zustand/middleware/immer'

export type PaymentDataStorage = {
  paymentData: Record<PaymentData['id'], PaymentData>
  setPaymentData: (paymentData: PaymentData) => void
  setAllPaymentData: (paymentData: Record<PaymentData['id'], PaymentData>) => void
  getWithId: (id: PaymentData['id']) => PaymentData
  iterator: () => PaymentData[]
  initialize: () => Promise<unknown>
  getWithLabel: (label: PaymentData['label']) => PaymentData | undefined
  getWithType: (type: PaymentData['type']) => PaymentData[]
  removePaymentData: (id: PaymentData['id']) => void
}

export const usePaymentDataStore = create<PaymentDataStorage>()(
  immer((set, get) => ({
    paymentData: {},
    initialize: async () => {
      const initialPaymentData = (await paymentDataStorage.indexer.maps.getAll()) as Account['paymentData']
      set((state) => (state.paymentData = initialPaymentData))
    },
    setPaymentData: (paymentData: PaymentData) => {
      paymentDataStorage.setMap(paymentData.id, paymentData)
      set((state) => (state.paymentData[paymentData.id] = paymentData))
    },
    setAllPaymentData: (paymentData: Record<PaymentData['id'], PaymentData>) => {
      // TODO: is setArray still correct here?
      paymentDataStorage.setArray('paymentData', paymentData)
      set((state) => (state.paymentData = paymentData))
    },
    removePaymentData: (id: PaymentData['id']) => {
      // TODO: remove from storage here
      set((state) => {
        delete state.paymentData[id]
        return state
      })
    },
    iterator: () => Object.values(get().paymentData),
    getWithId: (id: PaymentData['id']) => get().paymentData[id],
    getWithLabel: (label: PaymentData['label']) =>
      get()
        .iterator()
        .find((d) => d.label === label),
    getWithType: (type: PaymentData['type']) =>
      get()
        .iterator()
        .filter((d) => d.type === type),
  })),
)
