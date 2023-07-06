import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { deepMerge, isContained, omit } from '../../utils/object'
import { createStorage, toZustandStorage } from '../../utils/storage'
import { buildPaymentDetailInfo } from './helpers/buildPaymentDetailInfo'
import { removeHashesFromPaymentDetailInfo } from './helpers/removeHashesFromPaymentDetailInfo'
import { PaymentDetailInfo } from './types'

const storeId = 'paymentDataStore'
const paymentDataStorage = createStorage(storeId)

type PaymentDataState = {
  paymentData: Record<string, PaymentData>
  paymentDetailInfo: PaymentDetailInfo
  migrated: boolean
}
export type PaymentMethodsStore = PaymentDataState & {
  reset: () => void
  setMigrated: () => void
  addPaymentData: (data: PaymentData) => void
  getPaymentData: (id: string) => PaymentData | undefined
  getPaymentDataByLabel: (label: string) => PaymentData | undefined
  getAllPaymentDataByType: (type: PaymentMethod) => PaymentData[]
  removePaymentData: (id: string) => void
  getPaymentDataArray: () => PaymentData[]
  searchPaymentData: (query: Partial<PaymentData>) => PaymentData[]
}

const defaultPaymentDataStore: PaymentDataState = {
  paymentData: {},
  paymentDetailInfo: {},
  migrated: false,
}

export const usePaymentDataStore = create<PaymentMethodsStore>()(
  persist(
    (set, get) => ({
      ...defaultPaymentDataStore,
      reset: () => set(defaultPaymentDataStore),
      setMigrated: () => set({ migrated: true }),
      addPaymentData: (data) => {
        const newPamentDetailInfo = buildPaymentDetailInfo(data)
        set((state) => ({
          paymentData: { ...state.paymentData, [data.id]: data },
          paymentDetailInfo: deepMerge(state.paymentDetailInfo, newPamentDetailInfo),
        }))
      },
      getPaymentData: (id) => get().paymentData[id],
      getPaymentDataByLabel: (label) =>
        get()
          .getPaymentDataArray()
          .find((data) => data.label === label),
      getAllPaymentDataByType: (type) =>
        get()
          .getPaymentDataArray()
          .filter((data) => data.type === type),
      removePaymentData: (id) => {
        const data = get().paymentData[id]
        if (!data) return

        set((state) => ({
          paymentData: omit(state.paymentData, id),
          paymentDetailInfo: removeHashesFromPaymentDetailInfo(state.paymentDetailInfo, data),
        }))
      },
      getPaymentDataArray: () => Object.values(get().paymentData),
      searchPaymentData: (query) =>
        get()
          .getPaymentDataArray()
          .filter((data) => isContained(query, data)),
    }),
    {
      name: storeId,
      version: 0,
      storage: createJSONStorage(() => toZustandStorage(paymentDataStorage)),
    },
  ),
)
