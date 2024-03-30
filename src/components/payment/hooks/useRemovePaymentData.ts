import { useMutation } from "@tanstack/react-query";
import { shallow } from "zustand/shallow";
import { useOfferPreferences } from "../../../store/offerPreferenes";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore";
import { getSelectedPaymentDataIds } from "../../../utils/account/getSelectedPaymentDataIds";
import { hashPaymentData } from "../../../utils/paymentMethod/hashPaymentData";
import { peachAPI } from "../../../utils/peachAPI";

export function useRemovePaymentData() {
  const [getPaymentData, removePaymentDataFromStore, getAllPaymentDataByType] =
    usePaymentDataStore(
      (state) => [
        state.getPaymentData,
        state.removePaymentData,
        state.getAllPaymentDataByType,
      ],
      shallow,
    );

  const [preferredPaymentMethods, setPaymentMethods] = useOfferPreferences(
    (state) => [state.preferredPaymentMethods, state.setPaymentMethods],
    shallow,
  );

  console.log("Alive here 0");
  return useMutation({
    mutationFn: async (id: PaymentData["id"]) => {
      const dataToBeRemoved = getPaymentData(id);
      if (!dataToBeRemoved) throw new Error("PAYMENT_DATA_NOT_FOUND");

      console.log("Data to be removed: ", dataToBeRemoved);
      const hashes = hashPaymentData(dataToBeRemoved).map((item) => item.hash);
      const { result, error: err } =
        await peachAPI.private.user.deletePaymentHash({
          hashes,
        });
      console.log("DeletePaymentHash result:", result);

      if (!result && err?.error !== "UNAUTHORIZED") {
        throw new Error("NETWORK_ERROR");
      }

      try {
        removePaymentDataFromStore(id);
      } catch (e) {
        console.error("Failed removing data: ", e);
      }
      return dataToBeRemoved;
    },
    onSuccess: (dataToBeRemoved) => {
      console.log("Data removed succesfully ! (?)");
      if (preferredPaymentMethods[dataToBeRemoved.type]) {
        const nextInLine = getAllPaymentDataByType(
          dataToBeRemoved.type,
        ).shift();
        const newPaymentMethods = { ...preferredPaymentMethods };
        if (nextInLine?.id) {
          newPaymentMethods[dataToBeRemoved.type] = nextInLine.id;
        }

        setPaymentMethods(getSelectedPaymentDataIds(newPaymentMethods));
      } else {
        console.log("No type ?");
        setPaymentMethods(getSelectedPaymentDataIds(preferredPaymentMethods));
      }
    },
  });
}
