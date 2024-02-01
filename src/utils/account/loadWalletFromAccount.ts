import { loadAccountFromBase58 } from "./loadAccountFromBase58";
import { loadAccountFromSeedPhrase } from "./loadAccountFromSeedPhrase";

export const loadWalletFromAccount = (account: Account) => {
  if (account.base58) return loadAccountFromBase58(account.base58);

  if (!account.mnemonic) throw Error("MISSING_SEED");

  return loadAccountFromSeedPhrase(account.mnemonic);
};
