import { getPaymentData, getSelectedPaymentDataIds } from '../../../utils/account'
import { isDefined } from '../../../utils/array/isDefined'
import { hasMopsConfigured } from '../../../utils/offer'
import { getPaymentMethods, isValidPaymentData } from '../../../utils/paymentMethod'

export const validateOfferDetailsStep = (
  offer: SellOfferDraft,
  preferredPaymentMethods: Settings['preferredPaymentMethods'],
) => {
  if (!offer.amount || !hasMopsConfigured(offer)) return false

  const paymentMethods = getPaymentMethods(offer.meansOfPayment)
  if (!paymentMethods.every((p) => offer.paymentData[p])) return false

  const selectedPaymentMethods = Object.keys(offer.paymentData)
  if (selectedPaymentMethods.length === 0) return false

  const paymentDataValid = getSelectedPaymentDataIds(preferredPaymentMethods)
    .map(getPaymentData)
    .filter(isDefined)
    .every(isValidPaymentData)
  return paymentDataValid
}
