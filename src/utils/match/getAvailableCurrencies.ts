export const getAvailableCurrencies = (
  offerMeansOfPayment: (SellOffer | BuyOffer)['meansOfPayment'],
  matchMeansOfPayment: Match['meansOfPayment'],
  paymentMethod: PaymentMethod,
): Currency[] => {
  const offerCurrencies = (Object.keys(offerMeansOfPayment) as Currency[]).filter((currency) =>
    offerMeansOfPayment[currency]?.includes(paymentMethod),
  )
  const matchCurrencies = (Object.keys(offerMeansOfPayment) as Currency[]).filter((currency) =>
    matchMeansOfPayment[currency]?.includes(paymentMethod),
  )
  const sharedCurrencies = matchCurrencies.filter((c) => offerCurrencies.includes(c))
  const availableCurrencies = sharedCurrencies.length ? sharedCurrencies : matchCurrencies
  return availableCurrencies
}
