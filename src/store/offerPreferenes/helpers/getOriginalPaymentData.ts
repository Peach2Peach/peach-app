import { getSelectedPaymentDataIds } from '../../../utils/account'
import { isDefined } from '../../../utils/validation'
import { usePaymentDataStore } from '../../usePaymentDataStore'

export const getOriginalPaymentData = (paymentMethods: Partial<Record<PaymentMethod, string>>) =>
  getSelectedPaymentDataIds(paymentMethods).map(usePaymentDataStore.getState().getPaymentData)
    .filter(isDefined)
