import { useCallback } from "react";
import { shallow } from "zustand/shallow";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore";
import i18n from "../../../utils/i18n";

export const usePaymentMethodLabel = () => {
  const paymentMethods = usePaymentDataStore(
    (state) => Object.values(state.paymentData),
    shallow,
  );

  const getPaymentMethodLabel = useCallback(
    (paymentMethod: PaymentMethod) => {
      const numberOfExistingMethods = paymentMethods.filter(
        (data) => data.type === paymentMethod,
      ).length;
      let label = i18n(`paymentMethod.${paymentMethod}`);
      if (numberOfExistingMethods > 0)
        label += ` #${numberOfExistingMethods + 1}`;
      return label;
    },
    [paymentMethods],
  );

  return getPaymentMethodLabel;
};
