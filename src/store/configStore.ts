import create, { createStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { createStorage, toZustandStorage } from '../utils/storage'
import { defaultConfig } from './defaults'

type ConfigStore = Config & {
  setPaymentMethods: (paymentMethods: PaymentMethodInfo[]) => void
  setPeachPGPPublicKey: (pgpPublicKey: string) => void
  setPeachFee: (fee: number) => void
  setMinAppVersion: (ver: string) => void
  setLatestAppVersion: (ver: string) => void
  setMinTradingAmount: (amount: number) => void
  setMaxTradingAmount: (amount: number) => void
}

export const configStorage = createStorage('config')

export const configStore = createStore(
  persist<ConfigStore>(
    (set) => ({
      ...defaultConfig,
      setPaymentMethods: (paymentMethods) => set((state) => ({ ...state, paymentMethods })),
      setPeachPGPPublicKey: (peachPGPPublicKey) => set((state) => ({ ...state, peachPGPPublicKey })),
      setPeachFee: (peachFee) => set((state) => ({ ...state, peachFee })),
      setMinAppVersion: (minAppVersion) => set((state) => ({ ...state, minAppVersion })),
      setLatestAppVersion: (latestAppVersion) => set((state) => ({ ...state, latestAppVersion })),
      setMinTradingAmount: (minTradingAmount) => set((state) => ({ ...state, minTradingAmount })),
      setMaxTradingAmount: (maxTradingAmount) => set((state) => ({ ...state, maxTradingAmount })),
    }),
    {
      name: 'config',
      version: 0,
      getStorage: () => toZustandStorage(configStorage),
    },
  ),
)

export const useConfigStore = create(configStore)
