import { PAYMENTMETHODINFOS } from "../../paymentMethods";

export const isPaymentMethod = (string: string): string is PaymentMethod =>
  PAYMENTMETHODINFOS.some(({ id }) => id === string);
