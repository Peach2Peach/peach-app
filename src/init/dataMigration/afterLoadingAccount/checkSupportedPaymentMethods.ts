import { useOfferPreferences } from "../../../store/offerPreferences";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore";
import { waitForHydration } from "../../../store/waitForHydration";
import { getNewPreferredPaymentMethods } from "../../../utils/account/getNewPreferredPaymentMethods";
import { getSelectedPaymentDataIds } from "../../../utils/account/getSelectedPaymentDataIds";

export const checkSupportedPaymentMethods = async (
  paymentInfo: PaymentMethodInfo[],
) => {
  await waitForHydration(usePaymentDataStore);
  const paymentData = usePaymentDataStore.getState().getPaymentDataArray();
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
    .setPaymentMethods(getSelectedPaymentDataIds(newPreferredPaymentMethods));
  updatedPaymentData.forEach((data) =>
    usePaymentDataStore.getState().setPaymentDataHidden(data.id, data.hidden),
  );

  return updatedPaymentData;
};
