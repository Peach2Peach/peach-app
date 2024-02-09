import { PAYMENTMETHODINFOS } from "../../paymentMethods";

export const paymentMethodAllowedForCurrency = (
  paymentMethod: PaymentMethod,
  currency: Currency,
) => {
  const paymentMethodInfo = PAYMENTMETHODINFOS.find(
    (info) => info.id === paymentMethod,
  );
  return paymentMethodInfo?.currencies.some((c) => currency === c);
};
