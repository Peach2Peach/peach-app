import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { User69 } from "../../../../peach-api/src/@types/user69";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import { useAccountStore } from "../../../utils/account/account";
import { getMessageToSignForAddress } from "../../../utils/account/getMessageToSignForAddress";
import { error } from "../../../utils/log/error";
import { peachAPI } from "../../../utils/peachAPI";
import { signAndEncrypt } from "../../../utils/pgp/signAndEncrypt";
import { user69DetailsKeys } from "./useUser69";

export const useUploadPayoutAddressToServer = () => {
  const queryClient = useQueryClient();
  const myPgpPubKey = useAccountStore((state) => state.account.pgp.publicKey);
  const userId = useAccountStore((state) => state.account.publicKey);

  return useCallback(async () => {
    const { payoutAddress, payoutAddressLabel, payoutAddressSignature } =
      useSettingsStore.getState();
    try {
      const confirmationPhrase = payoutAddress
        ? getMessageToSignForAddress(userId, payoutAddress)
        : null;
      const payload = JSON.stringify({
        address: payoutAddress ?? null,
        label: payoutAddressLabel ?? null,
        confirmationPhrase,
        bip322Signature: payoutAddressSignature ?? null,
      });
      const { signature, encrypted } = await signAndEncrypt(
        payload,
        myPgpPubKey,
      );
      await peachAPI.private.peach069.setEncryptedCustomPayoutAddressOnSelfUser69(
        {
          encryptedCustomPayoutAddress: encrypted,
          encryptedCustomPayoutAddressSignature: signature,
        },
      );
      queryClient.setQueryData<User69 | null | undefined>(
        user69DetailsKeys.details(),
        (prev) =>
          prev
            ? {
                ...prev,
                encryptedCustomPayoutAddress: encrypted,
                encryptedCustomPayoutAddressSignature: signature,
              }
            : prev,
      );
    } catch (err) {
      error("Failed to send encrypted custom payout address:", err);
    }
  }, [myPgpPubKey, queryClient, userId]);
};
