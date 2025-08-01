import { PaymentMethodInfo } from "../../../peach-api/src/@types/payment";
import { useOfferPreferences } from "../../store/offerPreferenes";
import { usePaymentDataStore } from "../../store/usePaymentDataStore";
import { waitForHydration } from "../../store/waitForHydration";
import { getNewPreferredPaymentMethods } from "../../utils/account/getNewPreferredPaymentMethods";
import { isDefined } from "../../utils/validation/isDefined";

export const checkSupportedPaymentMethods = async (
  paymentInfo: PaymentMethodInfo[],
) => {
  await waitForHydration(usePaymentDataStore);
  const paymentData = Object.values(usePaymentDataStore.getState().paymentData);
  const updatedPaymentData = paymentData.map((data) => ({
    ...data,
    hidden: !paymentInfo.some((info) => data.type === info.id),
  }));

  const newPreferredPaymentMethods = getNewPreferredPaymentMethods(
    useOfferPreferences.getState().preferredPaymentMethods,
    updatedPaymentData,
  );
  useOfferPreferences
    .getState()
    .setPaymentMethods(
      Object.values(newPreferredPaymentMethods).filter(isDefined),
    );
  updatedPaymentData.forEach((data) =>
    usePaymentDataStore.getState().setPaymentDataHidden(data.id, data.hidden),
  );

  return updatedPaymentData;
};
