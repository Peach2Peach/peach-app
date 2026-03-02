import { useMutation } from "@tanstack/react-query";
import { shallow } from "zustand/shallow";
import { useOfferPreferences } from "../../../store/offerPreferenes";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore";
import { useAccountStore } from "../../../utils/account/account";
import { hashPaymentData } from "../../../utils/paymentMethod/hashPaymentData";
import { peachAPI } from "../../../utils/peachAPI";
import { signAndEncrypt } from "../../../utils/pgp/signAndEncrypt";
import { isDefined } from "../../../utils/validation/isDefined";

export function useRemovePaymentData() {
  const [paymentData, removePaymentDataFromStore] = usePaymentDataStore(
    (state) => [state.paymentData, state.removePaymentData],
    shallow,
  );

  const [preferredPaymentMethods, setPaymentMethods] = useOfferPreferences(
    (state) => [state.preferredPaymentMethods, state.setPaymentMethods],
    shallow,
  );

  const getPaymentData = usePaymentDataStore((state) => state.getPaymentData);
  const myPgpPubKey = useAccountStore((state) => state.account.pgp.publicKey);

  return useMutation({
    mutationFn: async (id: PaymentData["id"]) => {
      const dataToBeRemoved = paymentData[id];
      if (!dataToBeRemoved) throw new Error("PAYMENT_DATA_NOT_FOUND");

      const hashes = hashPaymentData(dataToBeRemoved).map((item) => item.hash);
      const { result, error: err } =
        await peachAPI.private.user.deletePaymentHash({
          hashes,
        });

      // if (!result && err?.error !== "UNAUTHORIZED") {

      //   throw new Error("NETWORK_ERROR");
      // }

      removePaymentDataFromStore(id);

      return dataToBeRemoved;
    },
    onSuccess: (dataToBeRemoved) => {
      if (preferredPaymentMethods[dataToBeRemoved.type]) {
        const nextInLine = Object.values(paymentData).find(
          (data) => data.type === dataToBeRemoved.type,
        );
        const newPaymentMethods = { ...preferredPaymentMethods };
        if (nextInLine?.id) {
          newPaymentMethods[dataToBeRemoved.type] = nextInLine.id;
        }
        setPaymentMethods(Object.values(newPaymentMethods).filter(isDefined));

        // const getPaymentData = usePaymentDataStore((state) => state.getPaymentData);
        // const myPgpPubKey = useAccountStore((state) => state.account.pgp.publicKey);
        const newPaymentData = getPaymentData();

        signAndEncrypt(JSON.stringify(newPaymentData), myPgpPubKey).then(
          async ({ signature, encrypted }) => {
            try {
              peachAPI.private.peach069.setEncryptedPaymentDataOnSelfUser69({
                encryptedPaymentData: encrypted,
                encryptedPaymentDataSignature: signature,
              });
            } catch (err) {
              console.error("Failed to send encrypted payment data:", err);
            }
          },
        );
      } else {
        setPaymentMethods(
          Object.values(preferredPaymentMethods).filter(isDefined),
        );
      }
    },
  });
}
