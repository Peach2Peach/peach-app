import { getCurrencies } from '../paymentMethod'

/**
 * @description Method to check whether offer has at least one MoP configured
 * @param offer the offer
 * @returns true if offer has MoPs configured
 */
export const hasMopsConfigured = (offer: Offer | OfferDraft): boolean => getCurrencies(offer.meansOfPayment).length > 0
