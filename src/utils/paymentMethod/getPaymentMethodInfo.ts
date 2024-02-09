import { PAYMENTMETHODINFOS } from "../../paymentMethods";

export const getPaymentMethodInfo = (id: string) =>
  PAYMENTMETHODINFOS.find((p) => p.id === id);
