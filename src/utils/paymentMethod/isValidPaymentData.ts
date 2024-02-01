import { usePaymentDataStore } from "../../store/usePaymentDataStore";
import { isCashTrade } from "./isCashTrade";
import { paymentMethodAllowedForCurrencies } from "./paymentMethodAllowedForCurrencies";
import { somePaymentDataExists } from "./somePaymentDataExists";

export const isValidPaymentData = (data: PaymentData) => {
  if (isCashTrade(data.type)) return true;
  if (!data.currencies) {
    // can be removed in a subsequent release. This prevents a crash introduced in 0.3.5
    return usePaymentDataStore.getState().removePaymentData(data.id);
  }
  if (!paymentMethodAllowedForCurrencies(data.type, data.currencies))
    return false;
  return somePaymentDataExists(data);
};
