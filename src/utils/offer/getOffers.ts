import { account } from '../account'
import { getOffer } from './getOffer'

/**
  * @description Method to get saved offers
  * @returns offers
  */
export const getOffers = (): (SellOffer|BuyOffer)[] => account.offers
  .map(o => getOffer(o.id || '') as (SellOffer|BuyOffer))
  .filter(o => o)
  .sort((a, b) => Number(a.id) < Number(b.id) ? 1 : -1)