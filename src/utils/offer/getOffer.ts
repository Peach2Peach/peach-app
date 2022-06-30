import { account } from '../account'

/**
  * @description Method to get saved offer
  * @param id offer id
  * @returns offer
  */
export const getOffer = (id: string): SellOffer|BuyOffer|null => {
  const offer = account.offers.find(c => c.id === id)

  if (!offer) return null

  if (!offer.seenMatches) offer.seenMatches = []

  if (offer.type === 'ask') {
    offer.funding.txIds = offer.funding.txIds || []
    offer.funding.vouts = offer.funding.vouts || []
    offer.funding.amounts = offer.funding.amounts || []
  }
  return offer
}