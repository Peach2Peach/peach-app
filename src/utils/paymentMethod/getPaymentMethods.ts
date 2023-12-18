import { unique } from '../array/unique'

export const getPaymentMethods = (meansOfPayment: MeansOfPayment): PaymentMethod[] =>
  Object.keys(meansOfPayment)
    .reduce((arr, c) => arr.concat((meansOfPayment as Required<MeansOfPayment>)[c as Currency]), [] as PaymentMethod[])
    .filter(unique())
