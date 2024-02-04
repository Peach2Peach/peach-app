import { useMutation } from "@tanstack/react-query";
import { useConfigStore } from "../../store/configStore/configStore";
import { peachAPI } from "../../utils/peachAPI";
import { signAndEncrypt } from "../../utils/pgp/signAndEncrypt";

type Props = {
  contract: Contract;
  symmetricKey?: string;
  reason: DisputeReason;
  email?: string;
  message?: string;
  paymentData?: PaymentData;
};

export function useRaiseDispute() {
  return useMutation({
    mutationFn: async ({
      symmetricKey,
      paymentData,
      contract,
      email,
      reason,
      message,
    }: Props) => {
      if (!symmetricKey) throw new Error("Symmetric key is required");
      const [
        { encrypted: symmetricKeyEncrypted },
        { encrypted: paymentDataSellerEncrypted },
      ] = await Promise.all([
        signAndEncrypt(
          symmetricKey,
          useConfigStore.getState().peachPGPPublicKey,
        ),
        paymentData
          ? signAndEncrypt(
              JSON.stringify(paymentData),
              useConfigStore.getState().peachPGPPublicKey,
            )
          : { encrypted: undefined },
      ]);
      const { result, error: err } =
        await peachAPI.private.contract.raiseDispute({
          contractId: contract.id,
          email,
          reason,
          message,
          symmetricKeyEncrypted,
          paymentDataSellerEncrypted,
        });

      if (!result) throw new Error(err?.message || "Could not raise dispute");
      return result;
    },
  });
}
