import { getOffers } from './getOffers'

/**
 * @description Method to sum up all required actions on current offers
 * @returns number of offers that require action
 */
export const getRequiredActionCount = (): number =>
  getOffers().reduce((sum, offer) => {
    const requiredAction
      = offer.tradeStatus === 'fundEscrow'
      || 'hasMatchesAvailable'
      || 'refundTxSignatureRequired'
      || ('paymentRequired' && offer.type === 'bid')
      || ('confirmPaymentRequired' && offer.type === 'ask')
      || 'dispute'
      || 'rateUser'
      || 'confirmCancelation'

    return requiredAction ? sum + 1 : sum
  }, 0)
