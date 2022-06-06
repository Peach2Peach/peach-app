import { account } from '.'

/**
 * @description Method to get payment data
 * @param id id of payment data to get
 */
export const getPaymentData = (id: PaymentData['id']) =>
  account.paymentData.find(data => data.id === id)