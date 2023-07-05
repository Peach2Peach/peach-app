import { getSelectedPaymentDataIds } from '../../../utils/account'
import { isDefined } from '../../../utils/validation'
import { usePaymentDataStore } from '../../usePaymentDataStore'
import { OfferPreferences } from '../useOfferPreferences'

export const getOriginalPaymentData = (paymentMethods: OfferPreferences['preferredPaymentMethods']): PaymentData[] =>
  getSelectedPaymentDataIds(paymentMethods).map(usePaymentDataStore.getState().getPaymentData).filter(isDefined)
