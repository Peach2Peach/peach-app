export const getAvailableCurrencies = (offer: SellOffer | BuyOffer, match: Match, paymentMethod: string): Currency[] => {
  const offerCurrencies = (Object.keys(offer.meansOfPayment) as Currency[]).filter((currency) =>
    offer.meansOfPayment[currency]?.includes(paymentMethod),
  )
  const matchCurrencies = (Object.keys(offer.meansOfPayment) as Currency[]).filter((currency) =>
    match.meansOfPayment[currency]?.includes(paymentMethod),
  )
  const sharedCurrencies = matchCurrencies.filter((c) => offerCurrencies.includes(c))
  const availableCurrencies = sharedCurrencies.length ? sharedCurrencies : matchCurrencies
  return availableCurrencies as Currency[]
}
