import { TransactionsResponse } from 'bdk-rn/lib/lib/interfaces'
import create, { createStore, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { createStorage } from '../storage'
import { toZustandStorage } from '../storage/toZustandStorage'

export type WalletState = {
  synced: boolean
  balance: number
  transactions: TransactionsResponse
  txOfferMap: Record<string, string>
}

type WalletStore = WalletState & {
  setSynced: (synced: boolean) => void
  setBalance: (balance: number) => void
  setTransactions: (txs: TransactionsResponse) => void
  updateTxOfferMap: (txid: string, offerId: string) => void
}

const defaultState: WalletState = {
  synced: false,
  balance: 0,
  transactions: { confirmed: [], pending: [] },
  txOfferMap: {},
}
export const walletStorage = createStorage('wallet')
;(async () => {
  console.log('walletStorage.getItem(txOfferMap)', await walletStorage.getItem('txOfferMap'))
})()

export const walletStore = createStore(
  persist<WalletStore>(
    (set) => ({
      ...defaultState,
      setSynced: (synced) => set((state) => ({ ...state, synced })),
      setBalance: (balance) => set((state) => ({ ...state, balance })),
      setTransactions: (transactions) => set((state) => ({ ...state, transactions })),
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
