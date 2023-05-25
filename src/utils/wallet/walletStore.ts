import { ConfirmedTransaction, PendingTransaction, TransactionsResponse } from 'bdk-rn/lib/lib/interfaces'
import { createStore, useStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStorage } from '../storage'
import { toZustandStorage } from '../storage/toZustandStorage'

export type WalletState = {
  synced: boolean
  balance: number
  addresses: string[]
  transactions: TransactionsResponse
  pendingTransactions: Record<string, string>
  txOfferMap: Record<string, string>
}

type WalletStore = WalletState & {
  reset: () => void
  setSynced: (synced: boolean) => void
  setAddresses: (addresses: string[]) => void
  setBalance: (balance: number) => void
  setTransactions: (txs: TransactionsResponse) => void
  getAllTransactions: () => (ConfirmedTransaction | PendingTransaction)[]
  getTransaction: (txId: string) => ConfirmedTransaction | PendingTransaction | undefined
  addPendingTransactionHex: (txId: string, hex: string) => void
  removePendingTransaction: (txId: string) => void
  updateTxOfferMap: (txid: string, offerId: string) => void
}

export const defaultWalletState: WalletState = {
  synced: false,
  addresses: [],
  balance: 0,
  transactions: { confirmed: [], pending: [] },
  pendingTransactions: {},
  txOfferMap: {},
}
export const walletStorage = createStorage('wallet')

export const walletStore = createStore(
  persist<WalletStore>(
    (set, get) => ({
      ...defaultWalletState,
      reset: () => set(() => defaultWalletState),
      setSynced: (synced) => set((state) => ({ ...state, synced })),
      setAddresses: (addresses) => set((state) => ({ ...state, addresses })),
      setBalance: (balance) => set((state) => ({ ...state, balance })),
      setTransactions: (transactions) => set((state) => ({ ...state, transactions })),
      getAllTransactions: () => [...get().transactions.confirmed, ...get().transactions.pending],
      getTransaction: (txId) =>
        get()
          .getAllTransactions()
          .find((tx) => tx.txid === txId),
      addPendingTransactionHex: (txid, hex) =>
        set({ pendingTransactions: { ...get().pendingTransactions, [txid]: hex } }),
      removePendingTransaction: (txid) => {
        const pendingTransactions = get().pendingTransactions
        delete pendingTransactions[txid]
        set({ pendingTransactions })
      },
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
      storage: createJSONStorage(() => toZustandStorage(walletStorage)),
    },
  ),
)

export const useWalletState = <T>(
  selector: (state: WalletStore) => T,
  equalityFn?: ((a: T, b: T) => boolean) | undefined,
) => useStore(walletStore, selector, equalityFn)
