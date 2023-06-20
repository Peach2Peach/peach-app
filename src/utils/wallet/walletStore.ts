import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStorage } from '../storage'
import { toZustandStorage } from '../storage/toZustandStorage'
import { migrateWalletStore } from './migration/migrateWalletStore'

export type WalletState = {
  balance: number
  addresses: string[]
  transactions: TransactionDetails[]
  pendingTransactions: Record<string, string>
  txOfferMap: Record<string, string>
}

export type WalletStore = WalletState & {
  reset: () => void
  setAddresses: (addresses: string[]) => void
  setBalance: (balance: number) => void
  setTransactions: (txs: TransactionDetails[]) => void
  getTransaction: (txId: string) => TransactionDetails | undefined
  addPendingTransactionHex: (txId: string, hex: string) => void
  removePendingTransaction: (txId: string) => void
  updateTxOfferMap: (txid: string, offerId: string) => void
}

export const defaultWalletState: WalletState = {
  addresses: [],
  balance: 0,
  transactions: [],
  pendingTransactions: {},
  txOfferMap: {},
}
export const walletStorage = createStorage('wallet')

export const useWalletState = create(
  persist<WalletStore>(
    (set, get) => ({
      ...defaultWalletState,
      reset: () => set(() => defaultWalletState),
      setAddresses: (addresses) => set({ addresses }),
      setBalance: (balance) => set({ balance }),
      setTransactions: (transactions) => set({ transactions }),
      getTransaction: (txId) => get().transactions.find((tx) => tx.txid === txId),
      addPendingTransactionHex: (txid, hex) =>
        set((state) => ({ pendingTransactions: { ...state.pendingTransactions, [txid]: hex } })),
      removePendingTransaction: (txid) => {
        const pendingTransactions = get().pendingTransactions
        delete pendingTransactions[txid]
        set({ pendingTransactions })
      },
      updateTxOfferMap: (txId: string, offerId: string) =>
        set((state) => ({
          txOfferMap: {
            ...state.txOfferMap,
            [txId]: offerId,
          },
        })),
    }),
    {
      name: 'wallet',
      version: 1,
      storage: createJSONStorage(() => toZustandStorage(walletStorage)),
      migrate: migrateWalletStore,
    },
  ),
)
