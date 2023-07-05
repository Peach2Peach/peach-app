import { account } from '.'

export const getPaymentDataByLabel = (label: PaymentData['label']) =>
  account.paymentData.find((data) => data.label === label)
