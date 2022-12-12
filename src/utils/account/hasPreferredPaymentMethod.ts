export const hasPreferredPaymentMethod = (account: Account, type: PaymentData['type']) =>
  account.settings.preferredPaymentMethods[type]
