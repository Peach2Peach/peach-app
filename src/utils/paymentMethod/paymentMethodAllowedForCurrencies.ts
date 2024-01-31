import { PAYMENTMETHODINFOS } from "../../paymentMethods";

export const paymentMethodAllowedForCurrencies = (
  paymentMethod: PaymentMethod,
  currencies: Currency[],
) => {
  const paymentMethodInfo = PAYMENTMETHODINFOS.find(
    (info) => info.id === paymentMethod,
  );
  return paymentMethodInfo?.currencies.some((c) => currencies.includes(c));
};
