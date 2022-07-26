import { sha256 } from '../crypto'

/**
 * @description Method to hash a payment data into hex representation using sha256
 * @param paymentData payment data to hash
 * @returns hashed payment data as hex
 */
export const hashPaymentData = (paymentData: PaymentData): string => {
  const data = JSON.parse(JSON.stringify(paymentData))

  delete data.id
  delete data.label
  delete data.type
  delete data.currencies

  return sha256(JSON.stringify(data).toLowerCase())
}