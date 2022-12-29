import create, { createStore } from 'zustand'

export type WalletState = {
  synced: boolean
  balance: number
}

type WalletStore = WalletState & {
  setSynced: (synced: boolean) => void
  setBalance: (balance: number) => void
}

const defaultState: WalletState = {
  synced: false,
  balance: 0,
}

export const walletStore = createStore<WalletStore>((set) => ({
  ...defaultState,
  setSynced: (synced) => set((state) => ({ ...state, synced })),
  setBalance: (balance) => set((state) => ({ ...state, balance })),
}))

export const useWalletState = create(walletStore)
