import { create } from 'zustand'

type TemporaryAccount = {
  temporaryAccount: Account | undefined
  setTemporaryAccount: (account: Account) => void
}

export const useTemporaryAccount = create<TemporaryAccount>((set) => ({
  temporaryAccount: undefined,
  setTemporaryAccount: (account) => set({ temporaryAccount: account }),
}))
