import { account } from '../account'
import { isDefined } from '../validation'
import { getOffer } from './getOffer'

export const getOffers = (): (SellOffer | BuyOffer)[] =>
  account.offers
    .map((o) => getOffer(o.id || ''))
    .filter(isDefined)
    .sort((a, b) => (Number(a.id) < Number(b.id) ? 1 : -1))
