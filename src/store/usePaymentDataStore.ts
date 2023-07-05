import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStorage, toZustandStorage } from '../utils/storage'

const storeId = 'paymentDataStore'
const paymentDataStorage = createStorage(storeId)

export const PaymentDataInfoFields: PaymentDataField[] = [
  'accountNumber',
  'beneficiary',
  'bic',
  'email',
  'iban',
  'name',
  'phone',
  'reference',
  'ukBankAccount',
  'ukSortCode',
  'userName',
  'wallet',
]

export type PaymentDetailInfo = Partial<Record<PaymentDataField, Record<string, string>>>

type PaymentDataState = {
  paymentData: Record<string, PaymentData>
  paymentDetailInfo: PaymentDetailInfo
  migrated: boolean
}
export type PaymentMethodsStore = PaymentDataState & {
  reset: () => void
  setMigrated: () => void
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
      setMigrated: () => set(() => ({ migrated: true })),
    }),
    {
      name: storeId,
      version: 0,
      storage: createJSONStorage(() => toZustandStorage(paymentDataStorage)),
    },
  ),
)
