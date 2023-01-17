import { SATSINBTC } from '../../constants'
import { round } from '../math'

export const getOfferPrice = (offer: SellOffer, currency: Currency): number => {
  if (!offer.prices) return 0
  const price = offer.prices[currency]
  if (!price) return 0

  return round((price * offer.amount * (1 + offer.premium / 100)) / SATSINBTC, 2)
}
