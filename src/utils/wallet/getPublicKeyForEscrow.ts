import { BIP32Interface } from "bip32";
import { getEscrowWallet } from "./getEscrowWallet";

/**
 * @deprecated
 */
export const getPublicKeyForEscrow = (
  wallet: BIP32Interface,
  offerId: string,
) => getEscrowWallet(wallet, offerId).publicKey.toString("hex");
