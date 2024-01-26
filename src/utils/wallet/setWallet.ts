import { BIP32Interface } from 'bip32'
import { PeachLiquidJSWallet } from './PeachLiquidJSWallet'
import { PeachWallet } from './PeachWallet'

export let wallet: BIP32Interface
export let peachWallet: PeachWallet
export let peachLiquidWallet: PeachLiquidJSWallet

/**
 * @deprecated
 */
export const setWallet = (wllt: BIP32Interface) => (wallet = wllt)

export const setPeachWallet = (wllt: PeachWallet) => (peachWallet = wllt)
export const setLiquidWallet = (wllt: PeachLiquidJSWallet) => (peachLiquidWallet = wllt)
