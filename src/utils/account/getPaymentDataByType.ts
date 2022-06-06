import { account } from '.'

/**
 * @description Method to get payment data
 * @param id id of payment data to get
 */
export const getPaymentDataByType = (type: PaymentData['type']) =>
  account.paymentData.filter(data => data.type === type)