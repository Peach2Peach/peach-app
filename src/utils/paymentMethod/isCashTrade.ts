export const isCashTrade = (
  paymentMethod: PaymentMethod,
): paymentMethod is CashPaymentMethds => paymentMethod.startsWith("cash");
