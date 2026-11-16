import { wallet } from "../wallet/setWallet";
import { signMessageWithWallet } from "./signMessageWithWallet";

/**
 * @description signs a message with the private key behind the Peach user id
 * (account public key). Used next to a release address' own signature so the
 * address ↔ Peach user binding is proven in both directions.
 */
export const signWithPeachUserKey = (message: string) => {
  if (!wallet) throw new Error("Wallet is not defined");
  return signMessageWithWallet(message, wallet);
};
