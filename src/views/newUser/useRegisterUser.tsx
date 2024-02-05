import { useMutation } from "@tanstack/react-query";
import { UNIQUEID } from "../../constants";
import { loadWalletFromAccount } from "../../utils/account/loadWalletFromAccount";
import { signMessageWithWallet } from "../../utils/account/signMessageWithWallet";
import { peachAPI } from "../../utils/peachAPI";
import { getAuthenticationChallenge } from "../../utils/peachAPI/getAuthenticationChallenge";

export function useRegisterUser() {
  return useMutation({
    mutationFn: async (account: Account & { mnemonic: string }) => {
      const wallet = loadWalletFromAccount(account);
      const message = getAuthenticationChallenge();
      const signature = signMessageWithWallet(message, wallet);

      const { result, error: authError } = await peachAPI.private.user.register(
        {
          publicKey: account.publicKey,
          message,
          signature,
          uniqueId: UNIQUEID,
        },
      );
      if (!result || authError) {
        throw new Error(authError?.error);
      }
      return result;
    },
  });
}
