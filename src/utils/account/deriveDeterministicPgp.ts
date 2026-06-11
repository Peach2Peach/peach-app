import { NETWORK } from "@env";
import pgp from "micro-key-producer/pgp.js";
import { createWalletFromSeedPhrase } from "../wallet/createWalletFromSeedPhrase";
import { getNetwork } from "../wallet/getNetwork";
import { getPgpAccount } from "./getPgpAccount";

/**
 * @description Deterministically derives the PGP keypair from the wallet seed —
 * the same derivation `createAccount` uses (`m/5914'/...`). Used to detect
 * whether the server's dominant PGP key is the seed-derived one and to produce
 * the new key during rotation.
 */
export const deriveDeterministicPgp = (mnemonic: string): PGPKeychain => {
  const { wallet } = createWalletFromSeedPhrase(mnemonic, getNetwork());
  const pgpKey = getPgpAccount(wallet, NETWORK);
  if (!pgpKey.privateKey) throw new Error("empty deterministic pgp private key");
  const finalKey = pgp(pgpKey.privateKey, "");
  return {
    privateKey: finalKey.privateKey,
    publicKey: finalKey.publicKey,
  };
};
