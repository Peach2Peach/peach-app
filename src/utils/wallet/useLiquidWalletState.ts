import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createPersistStorage } from '../../store/createPersistStorage'
import { createStorage } from '../storage/createStorage'

export type WalletState = {
  balance: number
  addresses: string[]
  isSynced: boolean
}

export type FundMultipleInfo = {
  address: string
}

export type WalletStore = WalletState & {
  reset: () => void
  setAddresses: (addresses: string[]) => void
  setBalance: (balance: number) => void
  setIsSynced: (isSynced: boolean) => void
}

export const defaultWalletState: WalletState = {
  addresses: [],
  balance: 0,
  isSynced: false,
}
export const liquidWalletStorage = createStorage('liquidWallet')
const storage = createPersistStorage(liquidWalletStorage)

export const useLiquidWalletState = create<WalletStore>()(
  persist(
    (set) => ({
      ...defaultWalletState,
      reset: () => set(() => defaultWalletState),
      setAddresses: (addresses) => set({ addresses }),
      setBalance: (balance) => set({ balance }),
      setIsSynced: (isSynced) => set({ isSynced }),
    }),
    {
      name: 'liquid-wallet',
      version: 0,
      storage,
      partialize: (state) => {
        const { isSynced: _unused, ...rest } = state
        return rest
      },
    },
  ),
)
