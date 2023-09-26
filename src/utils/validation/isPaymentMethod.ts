import { PAYMENTMETHODS } from '../../paymentMethods'

export const isPaymentMethod = (string: string): string is PaymentMethod =>
  PAYMENTMETHODS.includes(string as PaymentMethod)
