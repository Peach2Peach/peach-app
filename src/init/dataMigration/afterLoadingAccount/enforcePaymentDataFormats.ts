import { updatePaymentData } from '../../../utils/account'
import { enforceFormatOnPaymentData } from '../../../utils/format'

export const enforcePaymentDataFormats = (paymentData: PaymentData[]) => {
  const updatedPaymentData = paymentData.map(enforceFormatOnPaymentData)
  updatePaymentData(updatedPaymentData)
}
