import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { User69 } from "../../../../peach-api/src/@types/user69";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import { useAccountStore } from "../../../utils/account/account";
import { error } from "../../../utils/log/error";
import { peachAPI } from "../../../utils/peachAPI";
import { signAndEncrypt } from "../../../utils/pgp/signAndEncrypt";
import { user69DetailsKeys } from "./useUser69";

export const useUploadRefundAddressToServer = () => {
  const queryClient = useQueryClient();
  const myPgpPubKey = useAccountStore((state) => state.account.pgp.publicKey);

  return useCallback(async () => {
    const { refundAddress, refundAddressLabel } = useSettingsStore.getState();
    try {
      const payload = JSON.stringify({
        address: refundAddress ?? null,
        label: refundAddressLabel ?? null,
      });
      const { signature, encrypted } = await signAndEncrypt(
        payload,
        myPgpPubKey,
      );
      await peachAPI.private.peach069.setEncryptedCustomRefundAddressOnSelfUser69(
        {
          encryptedCustomRefundAddress: encrypted,
          encryptedCustomRefundAddressSignature: signature,
        },
      );
      queryClient.setQueryData<User69 | null | undefined>(
        user69DetailsKeys.details(),
        (prev) =>
          prev
            ? {
                ...prev,
                encryptedCustomRefundAddress: encrypted,
                encryptedCustomRefundAddressSignature: signature,
              }
            : prev,
      );
    } catch (err) {
      error("Failed to send encrypted custom refund address:", err);
    }
  }, [myPgpPubKey, queryClient]);
};
