import { createPeachAccount } from "../../../utils/account/createPeachAccount";
import { loadWalletFromAccount } from "../../../utils/account/loadWalletFromAccount";
import { peachAPI } from "../../../utils/peachAPI";

export async function setupPeachAccount(
  recoveredAccount: Account & { mnemonic: string },
) {
  const wallet = loadWalletFromAccount(recoveredAccount);
  const peachAccount = createPeachAccount(wallet);
  peachAPI.setPeachAccount(peachAccount);

  const { accessToken, error } = await peachAPI.fetchAccessToken();

  if (error) {
    if (error.error === "NOT_FOUND") return undefined;
    throw new Error(error.error);
  }

  return accessToken;
}
