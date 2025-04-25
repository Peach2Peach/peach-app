import { useConfigStore } from "../../store/configStore/configStore";

export const isPaymentMethod = (string: string): string is PaymentMethod =>
  useConfigStore.getState().paymentMethods.some(({ id }) => id === string);
