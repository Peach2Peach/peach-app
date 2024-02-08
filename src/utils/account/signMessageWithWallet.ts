import { NETWORK } from "@env";
import { BIP32Interface } from "bip32";
import { sha256 } from "bitcoinjs-lib/src/crypto";
import { getMainAccount } from "./getMainAccount";

export function signMessageWithWallet(message: string, wallet: BIP32Interface) {
  const firstAddress = getMainAccount(wallet, NETWORK);
  return firstAddress.sign(sha256(Buffer.from(message))).toString("hex");
}
