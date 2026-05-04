import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { User69 } from "../../../../peach-api/src/@types/user69";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore";
import { useAccountStore } from "../../../utils/account/account";
import { error } from "../../../utils/log/error";
import { peachAPI } from "../../../utils/peachAPI";
import { signAndEncrypt } from "../../../utils/pgp/signAndEncrypt";
import { user69DetailsKeys } from "./useUser69";

export const useUploadPaymentDataToServer = () => {
  const queryClient = useQueryClient();
  const getPaymentData = usePaymentDataStore((state) => state.getPaymentData);
  const myPgpPubKey = useAccountStore((state) => state.account.pgp.publicKey);

  return useCallback(async () => {
    const paymentData = getPaymentData();
    try {
      const { signature, encrypted } = await signAndEncrypt(
        JSON.stringify(paymentData),
        myPgpPubKey,
      );
      await peachAPI.private.peach069.setEncryptedPaymentDataOnSelfUser69({
        encryptedPaymentData: encrypted,
        encryptedPaymentDataSignature: signature,
      });
      queryClient.setQueryData<User69 | null | undefined>(
        user69DetailsKeys.details(),
        (prev) =>
          prev
            ? {
                ...prev,
                encryptedPaymentData: encrypted,
                encryptedPaymentDataSignature: signature,
              }
            : prev,
      );
    } catch (err) {
      error("Failed to send encrypted payment data:", err);
    }
  }, [getPaymentData, myPgpPubKey, queryClient]);
};
