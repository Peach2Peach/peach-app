import { StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserDataStore } from '.'
import { defaultAccount } from '../utils/account/account'
import { accountStorage } from '../utils/storage/accountStorage'
import { toZustandStorage } from '../utils/storage/toZustandStorage'

export type AccountStore = Account & {
  setAccount: (account: Account) => void
  updateSettings: (settings: Partial<Settings>) => void
  setTradingLimit: (tradingLimit: TradingLimit) => void
  setShowBackupReminder: (showBackupReminder: boolean) => void
  setAmount: (amount: number) => void
}

export const createAccountSlice: StateCreator<UserDataStore, [], [['zustand/persist', AccountStore]], AccountStore>
  = persist(
    (set) => ({
      ...defaultAccount,
      setAccount: (account: Account) => set((state) => ({ ...state, ...account })),
      updateSettings: (settings: Partial<Settings>) =>
        set((state) => ({ ...state, settings: { ...state.settings, ...settings } })),
      setShowBackupReminder: (showBackupReminder: boolean) =>
        set((state) => ({ ...state, settings: { ...state.settings, showBackupReminder } })),
      setAmount: (amount: number) => set((state) => ({ ...state, settings: { ...state.settings, amount } })),
      setTradingLimit: (tradingLimit: TradingLimit) => set((state) => ({ ...state, tradingLimit })),
    }),
    {
      name: 'account',
      version: 0,
      getStorage: () => toZustandStorage(accountStorage),
    },
  )
