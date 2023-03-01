import { getAllPaymentMethods } from './getAllPaymentMethods'

export const shouldUsePaymentMethod = (paymentCategories: PaymentCategories) => {
  const allPaymentMethods = getAllPaymentMethods(paymentCategories)

  return (info: PaymentMethodInfo) => info.id.startsWith('cash.') || allPaymentMethods.includes(info.id)
}
