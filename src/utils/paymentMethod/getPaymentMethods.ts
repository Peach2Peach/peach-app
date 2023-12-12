import { unique } from '../array/unique'

/**
 * @description Method to return all selected payment methods
 * @param meansOfPayment payment methods mapped to currency
 * @returns array of payment methods configured
 */
export const getPaymentMethods = (meansOfPayment: MeansOfPayment): PaymentMethod[] =>
  Object.keys(meansOfPayment)
    .reduce((arr, c) => arr.concat((meansOfPayment as Required<MeansOfPayment>)[c as Currency]), [] as PaymentMethod[])
    .filter(unique())
