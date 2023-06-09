import { getCurrencies } from '../paymentMethod'

export const hasMopsConfigured = (offer: Offer | OfferDraft): boolean => getCurrencies(offer.meansOfPayment).length > 0
