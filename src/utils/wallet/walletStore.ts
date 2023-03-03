import { ConfirmedTransaction, PendingTransaction, TransactionsResponse } from 'bdk-rn/lib/lib/interfaces'
import create, { createStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { createStorage } from '../storage'
import { toZustandStorage } from '../storage/toZustandStorage'

export type WalletState = {
  synced: boolean
  balance: number
  gapLimit: number
  addresses: string[]
  transactions: TransactionsResponse
  txOfferMap: Record<string, string>
}

type WalletStore = WalletState & {
  reset: () => void
  setSynced: (synced: boolean) => void
  setAddresses: (addresses: string[]) => void
  setGapLimit: (gapLimit: number) => void
  setBalance: (balance: number) => void
  setTransactions: (txs: TransactionsResponse) => void
  getAllTransactions: () => (ConfirmedTransaction | PendingTransaction)[]
  getTransaction: (txId: string) => ConfirmedTransaction | PendingTransaction | undefined
  updateTxOfferMap: (txid: string, offerId: string) => void
}

const defaultState: WalletState = {
  synced: false,
  addresses: [],
  gapLimit: 50,
  balance: 0,
  transactions: { confirmed: [], pending: [] },
  txOfferMap: {},
}
export const walletStorage = createStorage('wallet')

export const walletStore = createStore(
  persist<WalletStore>(
    (set, get) => ({
      ...defaultState,
      reset: () => set(() => defaultState),
      setSynced: (synced) => set((state) => ({ ...state, synced })),
      setAddresses: (addresses) => set((state) => ({ ...state, addresses })),
      setGapLimit: (gapLimit) => set((state) => ({ ...state, gapLimit })),
      setBalance: (balance) => set((state) => ({ ...state, balance })),
      setTransactions: (transactions) => set((state) => ({ ...state, transactions })),
      getAllTransactions: () => [...get().transactions.confirmed, ...get().transactions.pending],
      getTransaction: (txId) =>
        get()
          .getAllTransactions()
          .find((tx) => tx.txid === txId),
      updateTxOfferMap: (txId: string, offerId: string) =>
        set((state) => ({
          ...state,
          txOfferMap: {
            ...state.txOfferMap,
            [txId]: offerId,
          },
        })),
    }),
    {
      name: 'wallet',
      version: 0,
      getStorage: () => toZustandStorage(walletStorage),
    },
  ),
)

export const useWalletState = create(walletStore)
