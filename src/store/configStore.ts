import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { error } from '../utils/log'
import { createStorage } from '../utils/storage'
import { dateTimeReviver } from '../utils/system'
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
  setSeenDisputeDisclaimer: (seenDisputeDisclaimer: boolean) => void
  setHasSeenGroupHugAnnouncement: (hasSeenGroupHugAnnouncement: boolean) => void
}

export const configStorage = createStorage('config')

export const useConfigStore = create(
  persist<ConfigStore>(
    (set) => ({
      ...defaultConfig,
      reset: () => set(() => defaultConfig),
      setPaymentMethods: (paymentMethods) => set({ paymentMethods }),
      setPeachPGPPublicKey: (peachPGPPublicKey) => set({ peachPGPPublicKey }),
      setPeachFee: (peachFee) => set({ peachFee }),
      setMinAppVersion: (minAppVersion) => set({ minAppVersion }),
      setLatestAppVersion: (latestAppVersion) => set({ latestAppVersion }),
      setMinTradingAmount: (minTradingAmount) => set({ minTradingAmount }),
      setMaxTradingAmount: (maxTradingAmount) => set({ maxTradingAmount }),
      setSeenDisputeDisclaimer: (seenDisputeDisclaimer) => set({ seenDisputeDisclaimer }),
      setHasSeenGroupHugAnnouncement: (hasSeenGroupHugAnnouncement) => set({ hasSeenGroupHugAnnouncement }),
    }),
    {
      name: 'config',
      version: 0,
      storage: createJSONStorage(() => ({
        setItem: async (name: string, value: unknown) => {
          await configStorage.setItem(name, JSON.stringify(value))
        },
        getItem: async (name: string) => {
          const value = await configStorage.getItem(name)
          try {
            if (typeof value === 'string') return JSON.parse(value, dateTimeReviver)
          } catch (e) {
            error(e)
          }
          return null
        },
        removeItem: (name: string) => {
          configStorage.removeItem(name)
        },
      })),
    },
  ),
)
