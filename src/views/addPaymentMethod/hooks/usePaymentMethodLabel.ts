import { useCallback } from "react";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore";
import { useTranslate } from "@tolgee/react";

export const usePaymentMethodLabel = () => {
  const getAllPaymentDataByType = usePaymentDataStore(
    (state) => state.getAllPaymentDataByType,
  );
  const { t } = useTranslate("paymentMethod");

  const getPaymentMethodLabel = useCallback(
    (paymentMethod: PaymentMethod) => {
      const numberOfExistingMethods =
        getAllPaymentDataByType(paymentMethod).length;
      let label = t(`paymentMethod.${paymentMethod}`);
      if (numberOfExistingMethods > 0)
        label += ` #${numberOfExistingMethods + 1}`;
      return label;
    },
    [getAllPaymentDataByType, t],
  );

  return getPaymentMethodLabel;
};
