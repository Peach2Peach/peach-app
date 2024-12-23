import { NETWORK } from "@env";
import { BIP32Interface } from "bip32";
import OpenPGP from "react-native-fast-openpgp";
import { info } from "../log/info";
import { defaultAccount } from "./account";
import { getMainAccount } from "./getMainAccount";

export const createAccount = async ({
  wallet,
  mnemonic,
}: {
  wallet: BIP32Interface;
  mnemonic: string;
}) => {
  info("Create account");
  const publicKey = getMainAccount(wallet, NETWORK).publicKey.toString("hex");
  const recipient = await OpenPGP.generate({});

  return {
    ...defaultAccount,
    publicKey,
    mnemonic,
    base58: wallet.toBase58(),
    pgp: {
      privateKey: recipient.privateKey,
      publicKey: recipient.publicKey,
    },
  };
};
