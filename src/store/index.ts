import create from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { info } from '../utils/log'
import { AccountStore, createAccountSlice } from './createAccountSlice'
import { ContractsStore, createContractsSlice } from './createContractsSlice'
import { createOffersSlice, OffersStore } from './createOffersSlice'
import { createPaymentDataSlice, PaymentDataStorage } from './createPaymentDataSlice'

type UserDataFunctions = { initialize: () => void }

export type UserDataStore = AccountStore & ContractsStore & OffersStore & PaymentDataStorage & UserDataFunctions

export const useUserDataStore = create<UserDataStore>()(
  immer((...a) => ({
    ...createAccountSlice(...a),
    ...createContractsSlice(...a),
    ...createOffersSlice(...a),
    ...createPaymentDataSlice(...a),
    initialize: () => {
      info('useUserDataStore - initialize - start')
      a[1]().initializeContracts()
      a[1]().initializeOffers()
      a[1]().initializePaymentData()
      info('useUserDataStore - initialize - done')
    },
  })),
)
