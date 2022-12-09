import { BIP32Interface } from 'bip32'

export let wallet: BIP32Interface

export const setWallet = (wllt: BIP32Interface) => (wallet = wllt)
