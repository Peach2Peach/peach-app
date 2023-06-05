import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStorage, toZustandStorage } from '../utils/storage'

type Account = {
  identity?: Identity
  loggedIn: boolean
  migrated: boolean
}
type AccountStore = Account & {
  setIdentity: (identity: Identity) => void
  setMigrated: () => void
  reset: () => void
}

const defaultAccount: Account = {
  identity: undefined,
  loggedIn: false,
  migrated: false,
}

export const accountStorage = createStorage('accountStorage')

export const useAccountStore = create(
  persist<AccountStore>(
    (set) => ({
      ...defaultAccount,
      setIdentity: (identity) => set({ identity, loggedIn: !!identity.privKey }),
      setMigrated: () => set({ migrated: true }),
      reset: () => set(defaultAccount),
    }),
    {
      name: 'account',
      version: 0,
      storage: createJSONStorage(() => toZustandStorage(accountStorage)),
    },
  ),
)
