import { useConfigStore } from "../../store/configStore/configStore";

export const paymentMethodAllowedForCurrency = (
  paymentMethod: PaymentMethod,
  currency: Currency,
) => {
  const paymentMethodInfo = useConfigStore
    .getState()
    .paymentMethods.find((info) => info.id === paymentMethod);
  return paymentMethodInfo?.currencies.some((c) => currency === c);
};
