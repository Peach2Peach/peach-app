import { create } from 'zustand'

export type SessionState = {
  walletSynced: boolean
}

export const defaultSessionStore: SessionState = {
  walletSynced: false,
}

type SessionStore = SessionState & {
  reset: () => void
  setWalletSynced: (walletSynced: boolean) => void
}
export const useSessionStore = create<SessionStore>((set) => ({
  ...defaultSessionStore,
  reset: () => set(() => defaultSessionStore),
  setWalletSynced: (walletSynced) => set({ walletSynced }),
}))
