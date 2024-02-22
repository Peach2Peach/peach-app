import { BIP32Interface } from "bip32";
import { PeachLiquidJSWallet } from "./PeachLiquidJSWallet";
import { PeachWallet } from "./PeachWallet";

export let wallet: BIP32Interface;
export let peachWallet: PeachWallet | null = null;
export let peachLiquidWallet: PeachLiquidJSWallet | null = null;

/**
 * @deprecated
 */
export const setWallet = (wllt: BIP32Interface) => (wallet = wllt);

export const setPeachWallet = (wllt: PeachWallet) => (peachWallet = wllt);
export const setLiquidWallet = (wllt: PeachLiquidJSWallet) =>
  (peachLiquidWallet = wllt);

export const clearPeachWallet = () => (peachWallet = null);
export const clearPeachLiquidWallet = () => (peachLiquidWallet = null);
