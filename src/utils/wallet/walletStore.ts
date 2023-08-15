import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { keys, omit } from '../object'
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
  fundMultipleMap: Record<string, string[]>
  showBalance: boolean
}

export type FundMultipleInfo = {
  address: string
  offerIds: string[]
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
  registerFundMultiple: (address: string, offerIds: string[]) => void
  unregisterFundMultiple: (address: string) => void
  getFundMultipleByOfferId: (offerId: string) => FundMultipleInfo | undefined
  toggleShowBalance: () => void
}

export const defaultWalletState: WalletState = {
  addresses: [],
  balance: 0,
  transactions: [],
  pendingTransactions: {},
  txOfferMap: {},
  addressLabelMap: {},
  fundMultipleMap: {},
  showBalance: true,
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
      labelAddress: (address, label) =>
        set((state) => ({
          addressLabelMap: {
            ...state.addressLabelMap,
            [address]: label,
          },
        })),
      updateTxOfferMap: (txId, offerId) =>
        set((state) => ({
          txOfferMap: {
            ...state.txOfferMap,
            [txId]: offerId,
          },
        })),
      registerFundMultiple: (address, offerIds) =>
        set((state) => ({
          fundMultipleMap: {
            ...state.fundMultipleMap,
            [address]: offerIds,
          },
        })),
      unregisterFundMultiple: (address) =>
        set((state) => ({
          fundMultipleMap: omit(state.fundMultipleMap, address),
        })),
      getFundMultipleByOfferId: (offerId) => {
        const map = get().fundMultipleMap
        const address = keys(map).find((a) => map[a].includes(offerId))
        if (!address) return undefined
        const offerIds = map[address]
        return { address, offerIds }
      },
      toggleShowBalance: () => set((state) => ({ showBalance: !state.showBalance })),
    }),
    {
      name: 'wallet',
      version: 1,
      storage: createJSONStorage(() => toZustandStorage(walletStorage)),
      migrate: migrateWalletStore,
    },
  ),
)
