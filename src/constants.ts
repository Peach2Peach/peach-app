export const PEACHFEE = 1.5 // TODO fetch fee from API
export const CURRENCIES: Currency[] = [
  'EUR',
  'CHF',
  'GBP'
]
export const PAYMENTMETHODS: PaymentMethod[] = ['sepa']
export const BUCKETS = [
  250000,
  500000,
  1000000,
  2000000,
  5000000
]

// Time in ms
export const TIMERS = {
  kycResponse: 1000 * 60 * 60 * 12,
  paymentMade: 1000 * 60 * 60 * 12,
  paymentConfirmed: 1000 * 60 * 60 * 12,
}