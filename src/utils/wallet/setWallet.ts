import { BIP32Interface } from "bip32";
import { PeachWallet } from "./PeachWallet";

export let wallet: BIP32Interface;
export let peachWallet: PeachWallet;

/**
 * @deprecated
 */
export const setWallet = (wllt: BIP32Interface) => (wallet = wllt);

export const setPeachWallet = (wllt: PeachWallet) => (peachWallet = wllt);

// @ts-expect-error quick fix
export const clearPeachWallet = () => (peachWallet = undefined);
