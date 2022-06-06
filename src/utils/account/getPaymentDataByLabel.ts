import { account } from '.'

/**
 * @description Method to get payment data by label
 * @param label label of payment data to get
 */
export const getPaymentDataByLabel = (label: PaymentData['label']) =>
  account.paymentData.find(data => data.label === label)