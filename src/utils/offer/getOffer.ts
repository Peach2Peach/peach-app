import { account } from '../account'
import { isSellOffer } from './isSellOffer'

/**
 * @description Method to get saved offer
 * @param id offer id
 * @returns offer
 */
export const getOffer = (id: string): SellOffer | BuyOffer | undefined => {
  const offer = account.offers.find((c) => c.id === id)

  if (!offer) return undefined

  if (!offer.seenMatches) offer.seenMatches = []

  if (isSellOffer(offer)) {
    offer.funding.txIds = offer.funding.txIds || []
    offer.funding.vouts = offer.funding.vouts || []
    offer.funding.amounts = offer.funding.amounts || []
  }
  return offer
}
