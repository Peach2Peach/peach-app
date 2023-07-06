import { getBuildNumber, getUniqueIdSync, getVersion, isEmulatorSync } from 'react-native-device-info'
import { unique } from './utils/array'
import { sha256 } from './utils/crypto/sha256'
import { isCashTrade } from './utils/paymentMethod/isCashTrade'
import { IconType } from './assets/icons'
import { FlagType } from './components/flags'

export const SATSINBTC = 100000000
export const MSINANHOUR = 3600000
export const MSINADAY = MSINANHOUR * 24
export const MSINAMONTH = MSINADAY * 30

// time go automatically restart app when calling app from background after this time has passed
export const TIMETORESTART = 1000 * 60 * 5

export const MAXTRADESWITHOUTHBACKUP = 3

export const APPVERSION = getVersion()
export const BUILDNUMBER = getBuildNumber()

export let CLIENTSERVERTIMEDIFFERENCE = 0
export const setClientServerTimeDifference = (diff: number) => (CLIENTSERVERTIMEDIFFERENCE = diff)

export const ISEMULATOR = isEmulatorSync()

export const UNIQUEID = sha256(getUniqueIdSync())

export let CURRENCIES: Currency[] = [
  'EUR',
  'CHF',
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
  'USDT',
]

export let GIFTCARDCOUNTRIES: PaymentMethodCountry[] = ['DE', 'FR', 'IT', 'ES', 'NL', 'UK', 'SE', 'FI']
export const NATIONALTRANSFERCOUNTRIES: PaymentMethodCountry[] = [
  'BE',
  'BG',
  'CA',
  'CH',
  'CY',
  'CZ',
  'DE',
  'DK',
  'ES',
  'FI',
  'FR',
  'GB',
  'GR',
  'HU',
  'IT',
  'NL',
  'NO',
  'PL',
  'PO',
  'PT',
  'RO',
  'SE',
  'SI',
  'US',
]

export let PAYMENTMETHODS: PaymentMethod[] = ['sepa']
export let PAYMENTMETHODINFOS: PaymentMethodInfo[] = [
  {
    id: 'sepa',
    currencies: ['EUR'],
    anonymous: false,
  },
]

export const PAYMENTCATEGORIES: PaymentCategories = {
  bankTransfer: [
    'sepa',
    'instantSepa',
    'fasterPayments',
    'straksbetaling',
    ...NATIONALTRANSFERCOUNTRIES.map((c) => `nationalTransfer${c}` satisfies PaymentMethod),
  ],
  onlineWallet: [
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
  ],
  giftCard: ['giftCard.amazon', ...GIFTCARDCOUNTRIES.map((c) => `giftCard.amazon.${c}` satisfies PaymentMethod)],
  nationalOption: ['mbWay', 'bizum', 'satispay', 'mobilePay', 'keksPay', 'paylib', 'lydia', 'verse', 'iris'],
  cash: [],
  other: ['liquid'],
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

export const TWITTER = 'https://twitter.com/peachbitcoin'
export const INSTAGRAM = 'https://www.instagram.com/peachbitcoin'
export const TELEGRAM = 'https://t.me/+3KpdrMw25xBhNGJk'
export const DISCORD = 'https://discord.gg/skP9zqTB'
export const TWITCH = 'https://www.twitch.tv/peachbitcoin'

export const badgeIconMap: Record<Medal, IconType> = {
  superTrader: 'star',
  fastTrader: 'zap',
  ambassador: 'award',
}
