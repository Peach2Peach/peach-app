import { useConfigStore } from "../../store/configStore/configStore";

export const getPaymentMethodInfo = (id: string) =>
  useConfigStore.getState().paymentMethods.find((p) => p.id === id);
