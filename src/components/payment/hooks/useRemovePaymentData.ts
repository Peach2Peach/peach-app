import { useMutation } from "@tanstack/react-query";
import { shallow } from "zustand/shallow";
import { useUploadPaymentDataToServer } from "../../../hooks/query/peach069/useUploadPaymentDataToServer";
import { useOfferPreferences } from "../../../store/offerPreferenes";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore";
import { hashPaymentData } from "../../../utils/paymentMethod/hashPaymentData";
import { peachAPI } from "../../../utils/peachAPI";
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

  const uploadPaymentDataToServer = useUploadPaymentDataToServer();

  return useMutation({
    mutationFn: async (id: PaymentData["id"]) => {
      const dataToBeRemoved = paymentData[id];
      if (!dataToBeRemoved) throw new Error("PAYMENT_DATA_NOT_FOUND");

      const hashes = hashPaymentData(dataToBeRemoved).map((item) => item.hash);
      await peachAPI.private.user.deletePaymentHash({
        hashes,
      });

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

      uploadPaymentDataToServer();
    },
  });
}
