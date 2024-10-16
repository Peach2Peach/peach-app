import { useMutation } from "@tanstack/react-query";
import OpenPGP from "react-native-fast-openpgp";
import { useConfigStore } from "../../store/configStore/configStore";
import { peachAPI } from "../../utils/peachAPI";
import { useDecryptedContractData } from "../contractChat/useDecryptedContractData";

type Props = {
  symmetricKey?: string;
  reason: DisputeReason;
  email?: string;
  message?: string;
  paymentData?: PaymentData;
};

export function useRaiseDispute(contract: Contract) {
  const { data } = useDecryptedContractData(contract);
  const peachPGPPublicKey = useConfigStore((state) => state.peachPGPPublicKey);
  return useMutation({
    mutationFn: async ({ email, reason, message }: Props) => {
      if (!data) throw new Error("Could not decrypt contract data");
      const { symmetricKey, paymentData } = data;
      const [symmetricKeyEncrypted, paymentDataSellerEncrypted] =
        await Promise.all([
          OpenPGP.encrypt(symmetricKey, peachPGPPublicKey),
          OpenPGP.encrypt(JSON.stringify(paymentData), peachPGPPublicKey),
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
