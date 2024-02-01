import { useCallback } from "react";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore";
import i18n from "../../../utils/i18n";

export const usePaymentMethodLabel = () => {
  const getAllPaymentDataByType = usePaymentDataStore(
    (state) => state.getAllPaymentDataByType,
  );

  const getPaymentMethodLabel = useCallback(
    (paymentMethod: PaymentMethod) => {
      const numberOfExistingMethods =
        getAllPaymentDataByType(paymentMethod).length;
      let label = i18n(`paymentMethod.${paymentMethod}`);
      if (numberOfExistingMethods > 0)
        label += ` #${numberOfExistingMethods + 1}`;
      return label;
    },
    [getAllPaymentDataByType],
  );

  return getPaymentMethodLabel;
};
