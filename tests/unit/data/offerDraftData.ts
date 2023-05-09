import { defaultFundingStatus } from '../../../src/utils/offer/constants'
import { sellOffer } from './offerData'

export const getSellOfferDraft = (): SellOfferDraft => ({
  creationDate: new Date(),
  type: 'ask',
  amount: 1000000,
  premium: 1.5,
  returnAddress: 'returnAddress',
  paymentData: sellOffer.paymentData,
  funding: defaultFundingStatus,
  meansOfPayment: sellOffer.meansOfPayment,
  originalPaymentData: sellOffer.originalPaymentData,
})
