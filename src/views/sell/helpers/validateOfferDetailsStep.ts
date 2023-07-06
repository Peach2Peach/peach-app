import { OfferPreferences } from '../../../store/offerPreferenes/useOfferPreferences'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { getSelectedPaymentDataIds } from '../../../utils/account'
import { hasMopsConfigured } from '../../../utils/offer'
import { getPaymentMethods, isValidPaymentData } from '../../../utils/paymentMethod'
import { isDefined } from '../../../utils/validation'

export const validateOfferDetailsStep = (
  offer: SellOfferDraft,
  preferredPaymentMethods: OfferPreferences['preferredPaymentMethods'],
) => {
  if (!offer.amount || !hasMopsConfigured(offer)) return false

  const selectedPaymentMethods = Object.keys(offer.paymentData)
  if (selectedPaymentMethods.length === 0) return false

  const paymentMethods = getPaymentMethods(offer.meansOfPayment)
  if (!paymentMethods.every((p) => offer.paymentData[p])) return false

  const selectedPaymentDataIds = getSelectedPaymentDataIds(preferredPaymentMethods)
  if (selectedPaymentDataIds.length === 0) return false

  const paymentDataValid = selectedPaymentDataIds
    .map(usePaymentDataStore.getState().getPaymentData)
    .every((data) => isDefined(data) && isValidPaymentData(data))

  return paymentDataValid
}
