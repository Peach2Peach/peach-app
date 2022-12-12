import create from 'zustand'
import { persist } from 'zustand/middleware'
import { defaultAccount } from '../account/account'
import { accountStorage } from './accountStorage'
import { toZustandStorage } from './toZustandStorage'

export type AccountStore = Account & {
  setAccount: (account: Account) => void
  updateSettings: (settings: Partial<Settings>) => void
  setTradingLimit: (tradingLimit: TradingLimit) => void
}

export const useAccountStore = create<AccountStore>()(
  persist(
    (set) => ({
      ...defaultAccount,
      setAccount: (account: Account) => set((state) => ({ ...state, ...account })),
      updateSettings: (settings: Partial<Settings>) =>
        set((state) => ({ ...state, settings: { ...state.settings, ...settings } })),
      setTradingLimit: (tradingLimit: TradingLimit) => set((state) => ({ ...state, tradingLimit })),
    }),
    {
      name: 'account',
      version: 0,
      getStorage: () => toZustandStorage(accountStorage),
    },
  ),
)
