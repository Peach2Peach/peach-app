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

type BucketMap = {
  [key: string]: string
}
export const BUCKETMAP: BucketMap = {
  '250000': '250k',
  '500000': '500k',
  '1000000': '1M',
  '2000000': '2M',
  '5000000': '5M',
}