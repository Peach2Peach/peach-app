import { NETWORK } from "@env";
import { sha256 } from "bitcoinjs-lib/src/crypto";
import { createWalletFromBase58 } from "../wallet/createWalletFromBase58";
import { getNetwork } from "../wallet/getNetwork";
import { getMainAccount } from "./getMainAccount";

export const signMessageWithAccount = (
  message: string,
  account: Account & { base58: string },
) => {
  const wallet = createWalletFromBase58(account.base58, getNetwork());
  const firstAddress = getMainAccount(wallet, NETWORK);
  return firstAddress.sign(sha256(Buffer.from(message))).toString("hex");
};
