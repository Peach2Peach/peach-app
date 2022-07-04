import { getOffers } from './getOffers'
import { getOfferStatus } from './getOfferStatus'

/**
  * @description Method to sum up all required actions on current offers
  * @returns number of offers that require action
  */
export const getRequiredActionCount = (): number => getOffers().reduce((sum, offer) => {
  const { requiredAction } = getOfferStatus(offer)

  return requiredAction ? sum + 1 : sum
}, 0)