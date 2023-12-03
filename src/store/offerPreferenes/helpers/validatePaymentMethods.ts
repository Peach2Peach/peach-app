import { hasMopsConfigured } from '../../../utils/offer'
import { isValidPaymentData } from '../../../utils/paymentMethod'

export const validatePaymentMethods = ({
  originalPaymentData,
  meansOfPayment,
}: Pick<BuyOfferDraft | SellOfferDraft, 'originalPaymentData' | 'meansOfPayment'>) =>
  hasMopsConfigured(meansOfPayment) && originalPaymentData.every(isValidPaymentData)
