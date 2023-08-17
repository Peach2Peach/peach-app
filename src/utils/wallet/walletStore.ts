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
  addressLabelMap: Record<string, string>
  showBalance: boolean
  selectedUTXOIds: string[]
}

export type WalletStore = WalletState & {
  reset: () => void
  setAddresses: (addresses: string[]) => void
  setBalance: (balance: number) => void
  setTransactions: (txs: TransactionDetails[]) => void
  getTransaction: (txId: string) => TransactionDetails | undefined
  addPendingTransactionHex: (txId: string, hex: string) => void
  removePendingTransaction: (txId: string) => void
  labelAddress: (address: string, label: string) => void
  updateTxOfferMap: (txid: string, offerId: string) => void
  toggleShowBalance: () => void
  setSelectedUTXOIds: (utxos: string[]) => void
}

export const defaultWalletState: WalletState = {
  addresses: [],
  balance: 0,
  transactions: [],
  pendingTransactions: {},
  txOfferMap: {},
  addressLabelMap: {},
  showBalance: true,
  selectedUTXOIds: [],
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
      labelAddress: (address: string, label: string) =>
        set((state) => ({
          addressLabelMap: {
            ...state.addressLabelMap,
            [address]: label,
          },
        })),
      updateTxOfferMap: (txId: string, offerId: string) =>
        set((state) => ({
          txOfferMap: {
            ...state.txOfferMap,
            [txId]: offerId,
          },
        })),
      toggleShowBalance: () => set((state) => ({ showBalance: !state.showBalance })),
      setSelectedUTXOIds: (utxos) => set({ selectedUTXOIds: utxos }),
    }),
    {
      name: 'wallet',
      version: 1,
      storage: createJSONStorage(() => toZustandStorage(walletStorage)),
      migrate: migrateWalletStore,
    },
  ),
)
