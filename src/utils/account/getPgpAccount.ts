import { BIP32Interface } from "bip32";

export const getPgpAccount = (
  wallet: BIP32Interface,
  network: BitcoinNetwork,
) => wallet.derivePath(`m/5914'/${network === "bitcoin" ? "0" : "1"}'/0'/0'`);
