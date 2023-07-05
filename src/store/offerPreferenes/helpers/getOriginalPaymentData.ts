import { getPaymentData, getSelectedPaymentDataIds } from '../../../utils/account'
import { isDefined } from '../../../utils/validation'
import { OfferPreferences } from '../useOfferPreferences'

export const getOriginalPaymentData = (paymentMethods: OfferPreferences['preferredPaymentMethods']): PaymentData[] =>
  getSelectedPaymentDataIds(paymentMethods).map(getPaymentData).filter(isDefined)
