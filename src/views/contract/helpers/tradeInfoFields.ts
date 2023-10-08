import { GIFTCARDCOUNTRIES, NATIONALTRANSFERCOUNTRIES } from '../../../paymentMethods'
import { TradeInfoField } from './tradeInformationGetters'

const createPastBuyTradeFields = (fields: TradeInfoField[]): TradeInfoField[][] => [
  ['youPaid', 'bitcoinPrice'],
  fields,
  ['seller', 'ratingBuyer'],
  ['tradeBreakdown'],
]
const createPastSellTradeFields = (fields: TradeInfoField[]): TradeInfoField[][] => [
  ['soldFor', 'bitcoinPrice'],
  fields,
  ['buyer', 'ratingSeller'],
]
const pastCashBuyTradeFields = createPastBuyTradeFields(['meetup'])
const pastBuyTradeFields = createPastBuyTradeFields(['via', 'reference', 'paymentConfirmed'])

const pastCashSellTradeFields = createPastSellTradeFields(['meetup'])
const pastSellTradeFields = createPastSellTradeFields(['paidToMethod', 'reference', 'paymentConfirmed'])

const createActiveBuyTradeFields = (fields: TradeInfoField[]): TradeInfoField[][] => [
  ['youShouldPay'],
  fields,
  ['seller', 'tradeId'],
]
const createActiveSellTradeFields = (fields: TradeInfoField[]): TradeInfoField[][] => [
  ['youWillGet'],
  fields,
  ['buyer', 'tradeId'],
]

const activeCashSellTradeFields = createActiveSellTradeFields(['meetup', 'location'])
const activeSellTradeFields: TradeInfoField[][] = createActiveSellTradeFields(['via', 'reference', 'paymentConfirmed'])

const activeCashBuyTradeFields = createActiveBuyTradeFields(['meetup', 'location'])
const wrapInSharedFields = (fields: TradeInfoField[]): TradeInfoField[][] =>
  createActiveBuyTradeFields(['via', ...fields])

const template1Fields: TradeInfoField[] = ['beneficiary', 'iban', 'bic', 'reference']
const template2Fields: TradeInfoField[] = ['wallet', 'email']
const template3Fields: TradeInfoField[] = ['beneficiary', 'phone', 'reference']
const template4Fields: TradeInfoField[] = ['beneficiary', 'email', 'reference']
const template5Fields: TradeInfoField[] = ['beneficiary', 'ukBankAccount', 'ukSortCode', 'reference']
const template6Fields: TradeInfoField[] = ['userName', 'email', 'phone', 'reference']
const template7Fields: TradeInfoField[] = ['beneficiary', 'accountNumber', 'reference']
const template8Fields: TradeInfoField[] = ['beneficiary', 'phone', 'reference']
const template9Fields: TradeInfoField[] = ['beneficiary', 'iban', 'accountNumber', 'bic', 'reference']
const template10Fields: TradeInfoField[] = ['receiveAddress']
const template11Fields: TradeInfoField[] = ['lnurlAddress']
const template12Fields: TradeInfoField[] = ['phone', 'reference']
const template13Fields: TradeInfoField[] = ['phone', 'email', 'reference']
const template18Fields: TradeInfoField[] = ['userName', 'reference']
const template19Fields: TradeInfoField[] = ['userName']
const template20Fields: TradeInfoField[] = ['beneficiary', 'postePayNumber']
const template22Fields: TradeInfoField[] = ['pixAlias']

const PaymentMethodFields: {
  [key in PaymentMethod]?: TradeInfoField[][]
} = {
  sepa: wrapInSharedFields(template1Fields),
  fasterPayments: wrapInSharedFields(template5Fields),
  instantSepa: wrapInSharedFields(template1Fields),
  paypal: wrapInSharedFields(template6Fields),
  revolut: wrapInSharedFields(template6Fields),
  vipps: wrapInSharedFields(template3Fields),
  advcash: wrapInSharedFields(template2Fields),
  blik: wrapInSharedFields(template3Fields),
  wise: wrapInSharedFields(template6Fields),
  twint: wrapInSharedFields(template3Fields),
  swish: wrapInSharedFields(template3Fields),
  satispay: wrapInSharedFields(template3Fields),
  mbWay: wrapInSharedFields(template3Fields),
  bizum: wrapInSharedFields(template3Fields),
  mobilePay: wrapInSharedFields(template3Fields),
  skrill: wrapInSharedFields(template4Fields),
  neteller: wrapInSharedFields(template4Fields),
  paysera: wrapInSharedFields(template8Fields),
  straksbetaling: wrapInSharedFields(template7Fields),
  keksPay: wrapInSharedFields(template3Fields),
  friends24: wrapInSharedFields(template3Fields),
  n26: wrapInSharedFields(template6Fields),
  paylib: wrapInSharedFields(template3Fields),
  lydia: wrapInSharedFields(template3Fields),
  iris: wrapInSharedFields(template3Fields),
  'giftCard.amazon': wrapInSharedFields(template4Fields),
  papara: wrapInSharedFields(template3Fields),
  liquid: wrapInSharedFields(template10Fields),
  lnurl: wrapInSharedFields(template11Fields),
  rappipay: wrapInSharedFields(template12Fields),
  mercadoPago: wrapInSharedFields(template13Fields),
  nequi: wrapInSharedFields(template3Fields),
  cbu: wrapInSharedFields(template7Fields),
  cvu: wrapInSharedFields(template7Fields),
  alias: wrapInSharedFields(template7Fields),
  bancolombia: wrapInSharedFields(template7Fields),
  orangeMoney: wrapInSharedFields(template12Fields),
  moov: wrapInSharedFields(template12Fields),
  wave: wrapInSharedFields(template12Fields),
  airtelMoney: wrapInSharedFields(template12Fields),
  'm-pesa': wrapInSharedFields(template12Fields),
  nationalTransferNG: wrapInSharedFields(template7Fields),
  chippercash: wrapInSharedFields(template18Fields),
  mtn: wrapInSharedFields(template12Fields),
  eversend: wrapInSharedFields(template18Fields),
  payday: wrapInSharedFields(template18Fields),
  sinpe: wrapInSharedFields(template1Fields),
  sinpeMovil: wrapInSharedFields(template3Fields),
  pix: wrapInSharedFields(template22Fields),
  rebellion: wrapInSharedFields(template19Fields),
  klasha: wrapInSharedFields(template19Fields),
  accrue: wrapInSharedFields(template19Fields),
  wirepay: wrapInSharedFields(template19Fields),
  bankera: wrapInSharedFields(template13Fields),
  postePay: wrapInSharedFields(template20Fields),
}

GIFTCARDCOUNTRIES.forEach((c) => (PaymentMethodFields[`giftCard.amazon.${c}`] = wrapInSharedFields(template4Fields)))

NATIONALTRANSFERCOUNTRIES.forEach(
  (c) => (PaymentMethodFields[`nationalTransfer${c}`] = wrapInSharedFields(template9Fields)),
)

export const tradeFields = {
  buyer: {
    past: {
      cash: pastCashBuyTradeFields,
      default: pastBuyTradeFields,
    },
    active: {
      cash: activeCashBuyTradeFields,
      default: PaymentMethodFields,
    },
  },
  seller: {
    past: {
      cash: pastCashSellTradeFields,
      default: pastSellTradeFields,
    },
    active: {
      cash: activeCashSellTradeFields,
      default: activeSellTradeFields,
    },
  },
}
