export const hasMultipleAvailableCurrencies = (paymentMethod: PaymentMethod) =>
  ['skrill', 'neteller'].includes(paymentMethod)
