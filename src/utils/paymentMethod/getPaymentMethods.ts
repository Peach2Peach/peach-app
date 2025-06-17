import { uniqueArray } from "../array/uniqueArray";

export const getPaymentMethods = (meansOfPayment: MeansOfPayment) =>
  Object.values(meansOfPayment).flat().filter(uniqueArray);
