export let PEACHFEE = 1.5
export const setPeachFee = (fee: number) => PEACHFEE = fee

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

type Timers = {
  [key in ContractAction]: number
}

// Time in ms
export const TIMERS: Timers = {
  none: 0,
  kycResponse: 1000 * 60 * 60 * 12,
  paymentMade: 1000 * 60 * 60 * 12,
  paymentConfirmed: 1000 * 60 * 60 * 12,
}