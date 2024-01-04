import { SATSINBTC } from '../../constants'
import { round } from '../math/round'

// eslint-disable-next-line max-params
export const getOfferPrice = (amount: number, premium: number, prices: Pricebook, currency: Currency): number => {
  const price = prices[currency]
  if (!price) return 0

  return round((price * amount * (1 + premium / 100)) / SATSINBTC, 2)
}
