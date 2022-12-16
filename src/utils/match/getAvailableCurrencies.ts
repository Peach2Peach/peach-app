export const getAvailableCurrencies = (
  mopsIncCommon: MeansOfPayment,
  matchMeansOfPayment: Match['meansOfPayment'],
): Currency[] => {
  const sharedCurrencies = Object.keys(mopsIncCommon) as Currency[]
  const matchCurrencies = (Object.keys(matchMeansOfPayment) as Currency[]).filter(
    (currency) => matchMeansOfPayment[currency],
  )
  const availableCurrencies = sharedCurrencies.length ? sharedCurrencies : matchCurrencies
  return availableCurrencies
}
