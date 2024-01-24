import { uniqueArray } from './utils/array/uniqueArray'
import { isCashTrade } from './utils/paymentMethod/isCashTrade'

export let CURRENCIES: Currency[] = [
  'SAT',
  'EUR',
  'CHF',
  'USD',
  'GBP',
  'SEK',
  'DKK',
  'BGN',
  'CZK',
  'HUF',
  'PLN',
  'RON',
  'ISK',
  'NOK',
  'TRY',
  'USDT',
  'ARS',
  'COP',
  'PEN',
  'MXN',
  'CLP',
  'PEN',
  'COP',
  'XOF',
  'NGN',
  'CDF',
  'CRC',
  'BRL',
]

export let GIFTCARDCOUNTRIES: PaymentMethodCountry[] = ['DE', 'FR', 'IT', 'ES', 'NL', 'UK', 'SE', 'FI']
export const NATIONALTRANSFERCOUNTRIES = [
  'BG',
  'CZ',
  'DK',
  'HU',
  'NO',
  'PL',
  'RO',
  'CH',
  'IS',
  'SE',
  'TR',
  'NG',
] as const

export let PAYMENTMETHODS: PaymentMethod[] = ['sepa']
export let PAYMENTMETHODINFOS: PaymentMethodInfo[] = [
  {
    id: 'sepa',
    currencies: ['EUR'],
    anonymous: false,
  },
]

const bankTransfer: PaymentMethod[] = [
  'alias',
  'bancolombia',
  'cbu',
  'cvu',
  'fasterPayments',
  'instantSepa',
  'sepa',
  'sinpe',
  'straksbetaling',
  ...NATIONALTRANSFERCOUNTRIES.map((c) => `nationalTransfer${c}` satisfies PaymentMethod),
]
const onlineWallet: PaymentMethod[] = [
  'accrue',
  'advcash',
  'airtelMoney',
  'bankera',
  'blik',
  'chippercash',
  'eversend',
  'friends24',
  'klasha',
  'm-pesa',
  'mercadoPago',
  'mobilePay',
  'moov',
  'mtn',
  'n26',
  'nequi',
  'neteller',
  'orangeMoney',
  'papara',
  'payday',
  'paypal',
  'paysera',
  'rappipay',
  'revolut',
  'sinpeMovil',
  'skrill',
  'swish',
  'twint',
  'vipps',
  'wave',
  'wirepay',
  'wise',
]
const giftCard: PaymentMethod[] = [
  'giftCard.amazon',
  ...GIFTCARDCOUNTRIES.map((c) => `giftCard.amazon.${c}` satisfies PaymentMethod),
]
const nationalOption: PaymentMethod[] = [
  'bizum',
  'iris',
  'keksPay',
  'lydia',
  'mbWay',
  'mobilePay',
  'paylib',
  'pix',
  'postePay',
  'rebellion',
  'satispay',
]
const other: PaymentMethod[] = ['liquid', 'lnurl']
const cash: PaymentMethod[] = []

export const PAYMENTCATEGORIES: PaymentCategories = {
  bankTransfer,
  onlineWallet,
  giftCard,
  nationalOption,
  cash,
  other,
}

export const setPaymentMethods = (paymentMethodInfos: PaymentMethodInfo[]) => {
  PAYMENTMETHODINFOS = paymentMethodInfos
  CURRENCIES = paymentMethodInfos.reduce((arr: Currency[], info) => arr.concat(info.currencies), []).filter(uniqueArray)
  GIFTCARDCOUNTRIES = paymentMethodInfos
    .reduce((arr: PaymentMethodCountry[], info) => arr.concat(info.countries || []), [])
    .filter(uniqueArray)
  PAYMENTMETHODS = paymentMethodInfos.map((method) => method.id)
  PAYMENTCATEGORIES.cash = [...PAYMENTCATEGORIES.cash, ...paymentMethodInfos.map(({ id }) => id).filter(isCashTrade)]
}
