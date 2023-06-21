import { account } from '.'

export const getPaymentDataByType = (type: PaymentData['type']) =>
  account.paymentData.filter((data) => data.type === type)
