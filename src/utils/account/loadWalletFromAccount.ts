import { loadAccountFromBase58 } from "./loadAccountFromBase58";
import { loadAccountFromSeedPhrase } from "./loadAccountFromSeedPhrase";

export const loadWalletFromAccount = (
  account: Account & { mnemonic: string },
) => {
  if (false && account.base58) return loadAccountFromBase58(account.base58);

  return loadAccountFromSeedPhrase(account.mnemonic);
};
