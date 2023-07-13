import { keys } from '../object'

export const getCurrencies = (meansOfPayment: MeansOfPayment): Currency[] =>
  keys(meansOfPayment).filter((c) => meansOfPayment[c]?.length)
