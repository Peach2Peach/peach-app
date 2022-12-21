/**
 * @description Method to check whether a payment method is selected
 * @param paymentMethod payment method
 * @param [selectedPaymentMethods] selected payment methods
 */
export const paymentMethodSelected = (paymentMethod: PaymentMethod, selectedPaymentMethods: PaymentMethod[] = []) =>
  selectedPaymentMethods.includes(paymentMethod)
