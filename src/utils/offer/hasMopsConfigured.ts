import { getCurrencies } from '../paymentMethod'

export const hasMopsConfigured = (offer: Pick<Offer | OfferDraft, 'meansOfPayment'>): boolean =>
  getCurrencies(offer.meansOfPayment).length > 0
