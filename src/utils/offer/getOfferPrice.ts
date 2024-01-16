import { SATSINBTC } from '../../constants'
import { round } from '../math/round'

type Params = {
  amount: number
  premium: number
  prices: Pricebook
  currency: Currency
}

export const getOfferPrice = ({ amount, premium, prices, currency }: Params) => {
  const price = prices[currency]
  if (!price) return 0

  return round((price * amount * (1 + premium / 100)) / SATSINBTC, 2)
}
