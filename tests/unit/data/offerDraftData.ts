import { defaultFundingStatus } from '../../../src/utils/offer/constants'
import { sellOffer } from './offerData'

export const getBuyOfferDraft = (): BuyOfferDraft => ({
  type: 'bid',
  amount: [100000, 1000000],
  releaseAddress: 'releaseAddress',
  paymentData: sellOffer.paymentData,
  meansOfPayment: sellOffer.meansOfPayment,
  originalPaymentData: [],
  maxPremium: null,
})
export const getSellOfferDraft = (): SellOfferDraft => ({
  type: 'ask',
  amount: 1000000,
  premium: 1.5,
  returnAddress: 'returnAddress',
  paymentData: sellOffer.paymentData,
  funding: defaultFundingStatus,
  meansOfPayment: sellOffer.meansOfPayment,
  originalPaymentData: [],
})
