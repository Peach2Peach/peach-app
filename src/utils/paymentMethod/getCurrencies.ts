export const getCurrencies = (meansOfPayment: MeansOfPayment): Currency[] =>
  (Object.keys(meansOfPayment) as Currency[]).filter((c) => meansOfPayment[c]?.length)
