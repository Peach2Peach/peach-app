import { StateCreator } from 'zustand'
import { paymentDataStorage } from '../utils/storage/paymentDataStorage'
import { immer } from 'zustand/middleware/immer'
import { UserDataStore } from '.'

export type PaymentDataStorage = {
  paymentData: Record<PaymentData['id'], PaymentData>
  setPaymentData: (paymentData: PaymentData) => void
  setAllPaymentData: (paymentData: Record<PaymentData['id'], PaymentData>) => void
  getPaymentDataById: (id: PaymentData['id']) => PaymentData
  getPaymentDataArray: () => PaymentData[]
  initializePaymentData: () => Promise<unknown>
  getPaymentDataByLabel: (label: PaymentData['label']) => PaymentData | undefined
  getPaymentDataByType: (type: PaymentData['type']) => PaymentData[]
  removePaymentData: (id: PaymentData['id']) => void
}

export const createPaymentDataSlice: StateCreator<UserDataStore, [], [['zustand/immer', never]], PaymentDataStorage>
  = immer((set, get) => ({
    paymentData: {},
    initializePaymentData: async () => {
      const initialPaymentData = (await paymentDataStorage.indexer.maps.getAll()) as Record<string, PaymentData>
      set((state) => ({ ...state, paymentData: initialPaymentData }))
    },
    setPaymentData: (paymentData: PaymentData) => {
      paymentDataStorage.setMap(paymentData.id, paymentData)
      set((state) => ({ ...state, paymentData: { ...state.paymentData, [paymentData.id]: paymentData } }))
    },
    setAllPaymentData: (paymentData: Record<PaymentData['id'], PaymentData>) => {
      Object.keys(paymentData).forEach((key) => {
        paymentDataStorage.setMap(key, paymentData[key])
      })
      set((state) => ({ ...state, paymentData }))
    },
    removePaymentData: (id: PaymentData['id']) => {
      paymentDataStorage.removeItem(id)
      set((state) => {
        delete state.paymentData[id]
        return { ...state }
      })
    },
    getPaymentDataArray: () => Object.values(get().paymentData),
    getPaymentDataById: (id: PaymentData['id']) => get().paymentData[id],
    getPaymentDataByLabel: (label: PaymentData['label']) =>
      get()
        .getPaymentDataArray()
        .find((d) => d.label === label),
    getPaymentDataByType: (type: PaymentData['type']) =>
      get()
        .getPaymentDataArray()
        .filter((d) => d.type === type),
  }))
