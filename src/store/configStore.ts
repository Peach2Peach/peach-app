import { createStore, useStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStorage, toZustandStorage } from '../utils/storage'
import { defaultConfig } from './defaults'

type ConfigStore = Config & {
  reset: () => void
  setPaymentMethods: (paymentMethods: PaymentMethodInfo[]) => void
  setPeachPGPPublicKey: (pgpPublicKey: string) => void
  setPeachFee: (fee: number) => void
  setMinAppVersion: (ver: string) => void
  setLatestAppVersion: (ver: string) => void
  setMinTradingAmount: (amount: number) => void
  setMaxTradingAmount: (amount: number) => void
  setSeenRedesignWelcome: (hasSeenRedesignWelcome: boolean) => void
  setSeenDisputeDisclaimer: (seenDisputeDisclaimer: boolean) => void
}

export const configStorage = createStorage('config')

export const configStore = createStore(
  persist<ConfigStore>(
    (set) => ({
      ...defaultConfig,
      reset: () => set(() => defaultConfig),
      setPaymentMethods: (paymentMethods) => set((state) => ({ ...state, paymentMethods })),
      setPeachPGPPublicKey: (peachPGPPublicKey) => set((state) => ({ ...state, peachPGPPublicKey })),
      setPeachFee: (peachFee) => set((state) => ({ ...state, peachFee })),
      setMinAppVersion: (minAppVersion) => set((state) => ({ ...state, minAppVersion })),
      setLatestAppVersion: (latestAppVersion) => set((state) => ({ ...state, latestAppVersion })),
      setMinTradingAmount: (minTradingAmount) => set((state) => ({ ...state, minTradingAmount })),
      setMaxTradingAmount: (maxTradingAmount) => set((state) => ({ ...state, maxTradingAmount })),
      setSeenRedesignWelcome: (hasSeenRedesignWelcome) => set((state) => ({ ...state, hasSeenRedesignWelcome })),
      setSeenDisputeDisclaimer: (seenDisputeDisclaimer) => set((state) => ({ ...state, seenDisputeDisclaimer })),
    }),
    {
      name: 'config',
      version: 0,
      storage: createJSONStorage(() => toZustandStorage(configStorage)),
    },
  ),
)

export const useConfigStore = <T>(
  selector: (state: ConfigStore) => T,
  equalityFn?: ((a: T, b: T) => boolean) | undefined,
) => useStore(configStore, selector, equalityFn)
