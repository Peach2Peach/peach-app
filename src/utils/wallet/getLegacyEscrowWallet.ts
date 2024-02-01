import { NETWORK } from "@env";
import { BIP32Interface } from "bip32";

/**
 * @deprecated
 */
export const getLegacyEscrowWallet = (
  wallet: BIP32Interface,
  offerId: string,
) =>
  wallet.derivePath(
    `m/48'/${NETWORK === "bitcoin" ? "0" : "1"}'/0'/${offerId}'`,
  );
