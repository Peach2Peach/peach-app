import { hashPaymentData } from '../paymentMethod'

/**
 * @description Method to check whether payment data has changed
 * @param dataA payment data
 * @param dataB payment data
 * @returns true if payment data changed
 */
export const paymentDataChanged = (dataA: PaymentData, dataB: PaymentData) =>
  hashPaymentData(dataA) !== hashPaymentData(dataB)