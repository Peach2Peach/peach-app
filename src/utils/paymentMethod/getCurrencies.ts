import { keys } from '../object/keys'

export const getCurrencies = (meansOfPayment: MeansOfPayment): Currency[] =>
  keys(meansOfPayment).filter((c) => meansOfPayment[c]?.length)
