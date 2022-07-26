/**
 * @description Method to return all configured currencies
 * @param meansOfPayment payment methods mapped to currency
 * @returns array of currencies configured
 */
export const getCurrencies = (meansOfPayment: MeansOfPayment): Currency[] =>
  (Object.keys(meansOfPayment) as Currency[])
    .filter(c => meansOfPayment[c]?.length)
