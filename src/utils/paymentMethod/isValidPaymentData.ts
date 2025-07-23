import { PaymentMethodInfo } from "../../../peach-api/src/@types/payment";
import { keys } from "../object/keys";
import { cleanPaymentData } from "./cleanPaymentData";
import { isCashTrade } from "./isCashTrade";

export const isValidPaymentData = (
  data: PaymentData,
  paymentMethods?: PaymentMethodInfo[],
) => {
  if (isCashTrade(data.type)) return true;
  if (
    !paymentMethods
      ?.find(({ id }) => id === data.type)
      ?.currencies.some((c) => data.currencies.includes(c))
  ) {
    return false;
  }
  return keys(cleanPaymentData(data)).some((key) => data[key]);
};
