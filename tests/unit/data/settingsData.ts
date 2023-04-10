const appVersion = '0.2.0'

export const settings1: Settings = {
  enableAnalytics: false,
  locale: 'en',
  displayCurrency: 'EUR',
  minBuyAmount: 200000,
  maxBuyAmount: 5000000,
  sellAmount: 200000,
  premium: 1.5,
  appVersion,
  meansOfPayment: {
    EUR: ['sepa'],
    CHF: ['sepa'],
  },
  preferredPaymentMethods: {},
  showBackupReminder: false,
  peachWalletActive: true,
  nodeURL: 'https://localhost:3000/',
  feeRate: 'halfHourFee',
}
