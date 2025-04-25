import { PaymentMethodInfo } from "../../../peach-api/src/@types/payment";
import { getAllPaymentMethods } from "./getAllPaymentMethods";
import { isCashTrade } from "./isCashTrade";

export const shouldUsePaymentMethod = (
  paymentCategories: PaymentCategories,
) => {
  const allPaymentMethods = getAllPaymentMethods(paymentCategories);

  return (info: PaymentMethodInfo) =>
    isCashTrade(info.id) || allPaymentMethods.includes(info.id);
};
