import { useMutation } from "@tanstack/react-query";
import { shallow } from "zustand/shallow";
import { useOfferPreferences } from "../../../store/offerPreferenes";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore";
import { getSelectedPaymentDataIds } from "../../../utils/account/getSelectedPaymentDataIds";
import { hashPaymentData } from "../../../utils/paymentMethod/hashPaymentData";
import { peachAPI } from "../../../utils/peachAPI";

export function useRemovePaymentData() {
  const [paymentData, removePaymentDataFromStore] = usePaymentDataStore(
    (state) => [state.paymentData, state.removePaymentData],
    shallow,
  );

  const [preferredPaymentMethods, setPaymentMethods] = useOfferPreferences(
    (state) => [state.preferredPaymentMethods, state.setPaymentMethods],
    shallow,
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

        setPaymentMethods(getSelectedPaymentDataIds(newPaymentMethods));
      } else {
        setPaymentMethods(getSelectedPaymentDataIds(preferredPaymentMethods));
      }
    },
  });
}
