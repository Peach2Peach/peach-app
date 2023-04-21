export const isCashTrade = (paymentMethod: PaymentMethod): paymentMethod is CashTrade =>
  paymentMethod.startsWith('cash')
