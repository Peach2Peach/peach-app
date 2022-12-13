import { BIP32Interface } from 'bip32'
import create from 'zustand'

export type WalletStore = {
  wallet?: BIP32Interface
  setWallet: (wallet: BIP32Interface) => void
}

export const useWalletStore = create<WalletStore>()((set) => ({
  wallet: undefined,
  setWallet: (wallet: BIP32Interface) => set((state) => ({ ...state, wallet })),
}))
