import { NETWORK } from "@env";
import { BIP32Interface } from "bip32";
import pgp from "micro-key-producer/pgp.js";
import { info } from "../log/info";
import { defaultAccount } from "./account";
import { getMainAccount } from "./getMainAccount";
import { getPgpAccount } from "./getPgpAccount";

export const createAccount = async ({
  wallet,
  mnemonic,
}: {
  wallet: BIP32Interface;
  mnemonic: string;
}) => {
  info("Create account");
  const publicKey = getMainAccount(wallet, NETWORK).publicKey.toString("hex");

  const pgpKey = getPgpAccount(wallet, NETWORK);

  if (!pgpKey.privateKey) throw Error("empty deterministic pgp private key");

  const finalKey = pgp(pgpKey.privateKey, "");

  return {
    ...defaultAccount,
    publicKey,
    mnemonic,
    base58: wallet.toBase58(),
    pgp: {
      privateKey: finalKey.privateKey,
      publicKey: finalKey.publicKey,
    },
  };
};
