import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UNIQUEID } from "../../constants";
import { loadWalletFromAccount } from "../../utils/account/loadWalletFromAccount";
import { signMessageWithWallet } from "../../utils/account/signMessageWithWallet";
import { peachAPI } from "../../utils/peachAPI";
import { getAuthenticationChallenge } from "../../utils/peachAPI/getAuthenticationChallenge";

export function useRegisterUser() {
  const queryClient = useQueryClient();
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
        // Registration failures otherwise surface only as a generic error
        // screen; keep the server response visible for diagnosis.
        console.warn(
          "[peach] user registration failed",
          JSON.stringify(authError),
        );
        throw new Error(authError?.error);
      }
      console.warn("[peach] user registration succeeded");
      return result;
    },
    onSettled: () => queryClient.invalidateQueries(),
  });
}
