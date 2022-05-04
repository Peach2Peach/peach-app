import { unique } from './utils/array'
import { version } from '../package.json'

export const SATSINBTC = 100000000

export let PEACHFEE = 1.5
export const setPeachFee = (fee: number) => PEACHFEE = fee

export const APPVERSION = version
export let MINAPPVERSION = version
export const setMinAppVersion = (ver: string) => MINAPPVERSION = ver

export let CURRENCIES: Currency[] = [
  'EUR',
  'CHF',
  'GBP'
]
export let PAYMENTMETHODS: PaymentMethod[] = ['iban']
export let PAYMENTMETHODINFOS: PaymentMethodInfo[] = [
  {
    id: 'iban',
    currencies: ['EUR', 'CHF', 'GBP'],
    exchange: true
  }
]

export const setPaymentMethods = (paymentMethodInfos: PaymentMethodInfo[]) => {
  PAYMENTMETHODINFOS = paymentMethodInfos
  CURRENCIES = paymentMethodInfos
    .reduce((arr, info) => arr.concat(info.currencies), [] as Currency[])
    .filter(unique())
  PAYMENTMETHODS = paymentMethodInfos.map(method => method.id)
}

export let BUCKETS = [
  250000,
  500000,
  1000000,
  2000000,
  5000000
]
export const setBuckets = (buckets: number[]) => BUCKETS = buckets

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

// Reputation
export const GOLDMEDAL = 0.9
export const SILVERMEDAL = 0.7