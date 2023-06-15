import { account } from '.'

export const getPaymentData = (id: PaymentData['id']) => account.paymentData.find((data) => data.id === id)
