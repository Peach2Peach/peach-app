import { getSelectedPaymentDataIds } from "../../../utils/account/getSelectedPaymentDataIds";
import { isDefined } from "../../../utils/validation/isDefined";
import { usePaymentDataStore } from "../../usePaymentDataStore";

export const getOriginalPaymentData = (
  paymentMethods: Partial<Record<PaymentMethod, string>>,
) =>
  getSelectedPaymentDataIds(paymentMethods)
    .map((id) => usePaymentDataStore.getState().paymentData[id])
    .filter(isDefined);
