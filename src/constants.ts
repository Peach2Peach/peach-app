import { unique } from './utils/array'
import { version } from '../package.json'

export const SATSINBTC = 100000000

export let PEACHPGPPUBLICKEY = ''
export const setPeachPGPPublicKey = (pgpPublicKey: string) => PEACHPGPPUBLICKEY = pgpPublicKey

export let PEACHFEE = 0.015
export const setPeachFee = (fee: number) => PEACHFEE = fee

export const MAXMININGFEE = 20000

// iOS: go automatically to home screen when calling app from background after this time has passed
export const TIMETOGOHOME = 1000 * 60 * 5

export const APPVERSION = version
export let MINAPPVERSION = version
export const setMinAppVersion = (ver: string) => MINAPPVERSION = ver

export let CURRENCIES: Currency[] = [
  'EUR',
  'CHF',
  'GBP',
  'SEK',
]
export let PAYMENTMETHODS: PaymentMethod[] = ['sepa']
export let PAYMENTMETHODINFOS: PaymentMethodInfo[] = [
  {
    id: 'sepa',
    currencies: ['EUR', 'CHF', 'GBP'],
    exchange: true
  }
]

export const PAYMENTCATEGORIES: PaymentCategories = {
  bankTransfer: ['sepa', 'bankTransferCH', 'bankTransferUK'],
  onlineWallet: ['paypal', 'revolut', 'applePay', 'wise', 'twint', 'swish'],
  giftCard: [],
  cryptoCurrency: ['tether']
}

export const LOCALPAYMENTMETHODS: LocalPaymentMethods = {
  EUR: {
    PT: ['mbWay'],
    ES: ['bizum'],
  }
}

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
export let DEPRECATED_BUCKETS: number[] = []
export const setBuckets = (buckets: number[]) => BUCKETS = buckets
export const setDeprecatedBuckets = (buckets: number[]) => DEPRECATED_BUCKETS = buckets

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

export const MEDALS = ['fastTrader', 'superTrader', 'ambassador']
