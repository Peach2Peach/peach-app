import { useConfigStore } from "../../store/configStore/configStore";

export const paymentMethodAllowedForCurrencies = (
  paymentMethod: PaymentMethod,
  currencies: Currency[],
) => {
  const paymentMethodInfo = useConfigStore
    .getState()
    .paymentMethods.find((info) => info.id === paymentMethod);
  return paymentMethodInfo?.currencies.some((c) => currencies.includes(c));
};
