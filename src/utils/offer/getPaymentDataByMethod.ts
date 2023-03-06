import { account } from '../account'
import { hashPaymentData } from '../paymentMethod'

/**
 * @description Method to get payment data from account
 * @returns payment data or undefined
 */
export const getPaymentDataByMethod = (
  paymentMethod: PaymentMethod,
  hashedPaymentData: string,
): PaymentData | undefined => {
  const paymentData = account.paymentData.filter((data) => data.type === paymentMethod)

  const paymentDataHashes = paymentData.map(hashPaymentData)
  const index = paymentDataHashes.indexOf(hashedPaymentData)

  return paymentData[index]
}
