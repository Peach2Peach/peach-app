import { peachWallet } from "./setWallet";
import { getScriptPubKeyFromAddress } from "./transaction/getScriptPubKeyFromAddress";

/**
 * @description whether the Peach Wallet controls the keys for `address`. Throws
 * if the wallet is not loaded yet - callers must decide whether "unknown"
 * should be treated as "not mine".
 */
export const isAddressMine = (address: string) => {
  if (!peachWallet?.wallet) throw new Error("WALLET_NOT_READY");
  return peachWallet.wallet.isMine(getScriptPubKeyFromAddress(address));
};
