import { keys } from '../object/keys'

export const getAvailableCurrencies = (
  mopsIncCommon: MeansOfPayment,
  matchMeansOfPayment: MeansOfPayment,
): Currency[] => {
  const sharedCurrencies = keys(mopsIncCommon)
  const matchCurrencies = keys(matchMeansOfPayment).filter((currency) => matchMeansOfPayment[currency])
  const availableCurrencies = sharedCurrencies.length ? sharedCurrencies : matchCurrencies
  return availableCurrencies
}
