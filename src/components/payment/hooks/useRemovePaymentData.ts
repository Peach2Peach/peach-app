import { useMutation } from "@tanstack/react-query";
import { useShallow } from "zustand/shallow";
import { useOfferPreferences } from "../../../store/offerPreferenes";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore";
import { hashPaymentData } from "../../../utils/paymentMethod/hashPaymentData";
import { peachAPI } from "../../../utils/peachAPI";
import { isDefined } from "../../../utils/validation/isDefined";

export function useRemovePaymentData() {
  const [paymentData, removePaymentDataFromStore] = usePaymentDataStore(
    useShallow((state) => [state.paymentData, state.removePaymentData]),
  );

  const [preferredPaymentMethods, setPaymentMethods] = useOfferPreferences(
    useShallow((state) => [
      state.preferredPaymentMethods,
      state.setPaymentMethods,
    ]),
  );

  return useMutation({
    mutationFn: async (id: PaymentData["id"]) => {
      const dataToBeRemoved = paymentData[id];
      if (!dataToBeRemoved) throw new Error("PAYMENT_DATA_NOT_FOUND");

      const hashes = hashPaymentData(dataToBeRemoved).map((item) => item.hash);
      const { result, error: err } =
        await peachAPI.private.user.deletePaymentHash({
          hashes,
        });

      if (!result && err?.error !== "UNAUTHORIZED") {
        throw new Error("NETWORK_ERROR");
      }

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
      } else {
        setPaymentMethods(
          Object.values(preferredPaymentMethods).filter(isDefined),
        );
      }
    },
  });
}
