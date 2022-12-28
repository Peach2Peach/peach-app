import create, { createStore } from 'zustand'

export type WalletState = {
  balance: number
}

type WalletStore = WalletState & {
  setBalance: (balance: number) => void
}

const defaultState: WalletState = {
  balance: 0,
}

export const walletStore = createStore<WalletStore>((set) => ({
  ...defaultState,
  setBalance: (balance) => set((state) => ({ ...state, balance })),
}))

export const useWalletState = create(walletStore)
