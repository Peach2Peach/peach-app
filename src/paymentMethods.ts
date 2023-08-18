import { FlagType } from './components/flags'
import { CurrencyType } from './store/offerPreferenes/types'
import { unique } from './utils/array'
import { Country } from './utils/country/countryMap'
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
]
export const CURRENCY_MAP: Record<CurrencyType, Currency[]> = {
  europe: ['EUR', 'CHF', 'GBP', 'SEK', 'DKK', 'BGN', 'CZK', 'HUF', 'PLN', 'RON', 'ISK', 'NOK', 'TRY'],
  latinAmerica: ['ARS', 'COP', 'PEN', 'MXN', 'CLP', 'PEN', 'COP', 'CRC'],
  africa: ['USD', 'XOF', 'CDF', 'NGN'],
  other: ['USDT', 'SAT'],
}

export let GIFTCARDCOUNTRIES: Country[] = ['DE', 'FR', 'IT', 'ES', 'NL', 'UK', 'SE', 'FI']
export const NATIONALTRANSFERCOUNTRIES: PaymentMethodCountry[] = ['BG', 'CZ', 'DK', 'HU', 'NO', 'PL', 'RO']

export let PAYMENTMETHODS: PaymentMethod[] = ['sepa']
export let PAYMENTMETHODINFOS: PaymentMethodInfo[] = [
  {
    id: 'sepa',
    currencies: ['EUR'],
    anonymous: false,
  },
]

const bankTransfer: PaymentMethod[] = [
  'sepa',
  'instantSepa',
  'fasterPayments',
  'straksbetaling',
  'cbu',
  'cvu',
  'alias',
  'bancolombia',
  'sinpe',
  'nationalTransferNG',
  'nationalTransferTR',
  ...NATIONALTRANSFERCOUNTRIES.map((c) => `nationalTransfer${c}` satisfies PaymentMethod),
]
const onlineWallet: PaymentMethod[] = [
  'paypal',
  'revolut',
  'wise',
  'twint',
  'swish',
  'blik',
  'advcash',
  'vipps',
  'mobilePay',
  'skrill',
  'neteller',
  'paysera',
  'friends24',
  'n26',
  'mercadoPago',
  'rappipay',
  'nequi',
  'orangeMoney',
  'moov',
  'mtn',
  'wave',
  'airtelMoney',
  'm-pesa',
  'chippercash',
  'eversend',
  'papara',
  'sinpeMovil',
]
const giftCard: PaymentMethod[] = [
  'giftCard.amazon',
  ...GIFTCARDCOUNTRIES.map((c) => `giftCard.amazon.${c}` satisfies PaymentMethod),
]
const nationalOption: PaymentMethod[] = [
  'mbWay',
  'bizum',
  'satispay',
  'mobilePay',
  'keksPay',
  'paylib',
  'lydia',
  'verse',
  'iris',
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

export const ANONYMOUS_PAYMENTCATEGORIES = PAYMENTCATEGORIES.cash.concat(PAYMENTCATEGORIES.giftCard)

export const NATIONALOPTIONS: NationalOptions = {
  EUR: {
    IT: ['satispay'],
    PT: ['mbWay'],
    ES: ['bizum', 'verse'],
    FI: ['mobilePay'],
    HR: ['keksPay'],
    FR: ['paylib', 'lydia', 'satispay'],
    DE: ['satispay'],
    GR: ['iris'],
  },
}

export const NATIONALOPTIONCOUNTRIES: Record<'EUR', FlagType[]> = {
  EUR: ['IT', 'PT', 'ES', 'FI', 'HR', 'FR', 'DE', 'GR'],
}

export const APPLINKS: Record<string, { appLink?: string; url: string; userLink?: string }> = {
  papara: { url: 'https://www.papara.com' },
  paypal: {
    url: 'https://paypal.com/open_web',
    userLink: 'https://paypal.com/paypalme/',
  },
  revolut: {
    url: 'https://revolut.com/app',
    userLink: 'https://revolut.me/',
  },
  satispay: { url: 'https://satispay.com/app' },
  wise: { url: 'https://wise.com/user/account' },
  'giftCard.amazon.DE': { url: 'https://www.amazon.de/dp/B0B2Q4ZRDW' },
  'giftCard.amazon.FR': { url: 'https://www.amazon.fr/dp/B004MYH1YI' },
  'giftCard.amazon.IT': { url: 'https://www.amazon.it/dp/B07DWRCL44' },
  'giftCard.amazon.ES': { url: 'https://www.amazon.es/dp/B07H8STZ9N' },
  'giftCard.amazon.NL': { url: 'https://www.amazon.nl/dp/B07W6D728D' },
  'giftCard.amazon.UK': { url: 'https://www.amazon.co.uk/dp/B07S6C1DZ6' },
  'giftCard.amazon.SE': { url: 'https://www.amazon.se/dp/B089VNKFM7' },
}

export const setPaymentMethods = (paymentMethodInfos: PaymentMethodInfo[]) => {
  PAYMENTMETHODINFOS = paymentMethodInfos
  CURRENCIES = paymentMethodInfos.reduce((arr, info) => arr.concat(info.currencies), [] as Currency[]).filter(unique())
  GIFTCARDCOUNTRIES = paymentMethodInfos
    .reduce((arr, info) => arr.concat(info.countries || []), [] as PaymentMethodCountry[])
    .filter(unique())
  PAYMENTMETHODS = paymentMethodInfos.map((method) => method.id)
  PAYMENTCATEGORIES.cash = [...PAYMENTCATEGORIES.cash, ...paymentMethodInfos.map(({ id }) => id).filter(isCashTrade)]
}
