export const getAllPaymentMethods = (paymentCategories: PaymentCategories) =>
  Object.values(paymentCategories).flat();
