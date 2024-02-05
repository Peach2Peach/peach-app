import { createPeachAccount } from "../../../utils/account/createPeachAccount";
import { loadWalletFromAccount } from "../../../utils/account/loadWalletFromAccount";
import { peachAPI } from "../../../utils/peachAPI";

export async function setupPeachAccount(
  recoveredAccount: Account & { mnemonic: string },
) {
  const wallet = loadWalletFromAccount(recoveredAccount);
  const peachAccount = createPeachAccount(wallet);
  peachAPI.setPeachAccount(peachAccount);

  return (await peachAPI.authenticate())?.error?.error;
}
