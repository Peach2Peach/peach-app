import { BIP32Interface } from 'bip32'
import { PeachWallet } from './PeachWallet'

export let wallet: BIP32Interface
export let peachWallet: PeachWallet

export const setWallet = (wllt: BIP32Interface) => (wallet = wllt)
export const setPeachWallet = (wllt: PeachWallet) => (peachWallet = wllt)
