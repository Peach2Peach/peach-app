import { TransactionsResponse } from 'bdk-rn/lib/lib/interfaces'
import create, { createStore } from 'zustand'

export type WalletState = {
  synced: boolean
  balance: number
  transactions: TransactionsResponse
}

type WalletStore = WalletState & {
  setSynced: (synced: boolean) => void
  setBalance: (balance: number) => void
  setTransactions: (txs: TransactionsResponse) => void
}

const defaultState: WalletState = {
  synced: false,
  balance: 0,
  transactions: [],
}

export const walletStore = createStore<WalletStore>((set) => ({
  ...defaultState,
  setSynced: (synced) => set((state) => ({ ...state, synced })),
  setBalance: (balance) => set((state) => ({ ...state, balance })),
  setTransactions: (transactions) => set((state) => ({ ...state, transactions })),
}))

export const useWalletState = create(walletStore)
