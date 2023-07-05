import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStorage, toZustandStorage } from '../../utils/storage'
import { deepMerge } from '../../utils/object'
import { buildPaymentDetailInfo } from './helpers/buildPaymentDetailInfo'
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
}

const defaultPaymentDataStore: PaymentDataState = {
  paymentData: {},
  paymentDetailInfo: {},
  migrated: false,
}

export const usePaymentDataStore = create<PaymentMethodsStore>()(
  persist(
    (set) => ({
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
    }),
    {
      name: storeId,
      version: 0,
      storage: createJSONStorage(() => toZustandStorage(paymentDataStorage)),
    },
  ),
)
