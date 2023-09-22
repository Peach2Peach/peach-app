import { GIFTCARDCOUNTRIES, NATIONALTRANSFERCOUNTRIES } from '../../../../paymentMethods'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { TradeInfoField } from '../../../../views/contract/helpers/tradeInformationGetters'
import {
  Template1,
  Template10,
  Template11,
  Template12,
  Template13,
  Template14,
  Template15,
  Template16,
  Template17,
  Template18,
  Template19,
  Template2,
  Template20,
  Template21,
  Template22,
  Template3,
  Template4,
  Template5,
  Template6,
  Template7,
  Template8,
  Template9,
} from '../templates'
import { GiftCardAmazon } from './GiftCardAmazon'

type PaymentMethodFormsType = {
  [key in PaymentMethod]?: { component: (props: FormProps) => JSX.Element; fields: TradeInfoField[] }
}

const sharedFields: TradeInfoField[] = ['method', 'price']

const template1Fields: TradeInfoField[] = [...sharedFields, 'beneficiary', 'iban', 'bic', 'reference']
const template2Fields: TradeInfoField[] = [...sharedFields, 'wallet', 'email']
const template3Fields: TradeInfoField[] = [...sharedFields, 'beneficiary', 'phone', 'reference']
const template4Fields: TradeInfoField[] = [...sharedFields, 'beneficiary', 'email', 'reference']
const template5Fields: TradeInfoField[] = [...sharedFields, 'beneficiary', 'ukBankAccount', 'ukSortCode', 'reference']
const template6Fields: TradeInfoField[] = [...sharedFields, 'userName', 'email', 'phone', 'reference']
const template7Fields: TradeInfoField[] = [...sharedFields, 'beneficiary', 'accountNumber', 'reference']
const template8Fields: TradeInfoField[] = [...sharedFields, 'beneficiary', 'phone', 'reference']
const template9Fields: TradeInfoField[] = [...sharedFields, 'beneficiary', 'iban', 'accountNumber', 'bic', 'reference']
const template10Fields: TradeInfoField[] = [...sharedFields, 'receiveAddress']
const template11Fields: TradeInfoField[] = [...sharedFields, 'lnurlAddress']
const template12Fields: TradeInfoField[] = [...sharedFields, 'phone', 'reference']
const template13Fields: TradeInfoField[] = [...sharedFields, 'phone', 'email', 'reference']
const template18Fields: TradeInfoField[] = [...sharedFields, 'userName', 'reference']
const template19Fields: TradeInfoField[] = [...sharedFields, 'userName']
const template20Fields: TradeInfoField[] = [...sharedFields, 'beneficiary', 'postePayNumber']
const template22Fields: TradeInfoField[] = [...sharedFields, 'pixAlias']

export const PaymentMethodForms: PaymentMethodFormsType = {
  sepa: { component: Template1, fields: template1Fields },
  fasterPayments: { component: Template5, fields: template5Fields },
  instantSepa: { component: Template1, fields: template1Fields },
  paypal: { component: Template6, fields: template6Fields },
  revolut: { component: Template6, fields: template6Fields },
  vipps: { component: Template3, fields: template3Fields },
  advcash: { component: Template2, fields: template2Fields },
  blik: { component: Template3, fields: template3Fields },
  wise: { component: Template6, fields: template6Fields },
  twint: { component: Template3, fields: template3Fields },
  swish: { component: Template3, fields: template3Fields },
  satispay: { component: Template3, fields: template3Fields },
  mbWay: { component: Template3, fields: template3Fields },
  bizum: { component: Template3, fields: template3Fields },
  mobilePay: { component: Template3, fields: template3Fields },
  skrill: { component: Template4, fields: template4Fields },
  neteller: { component: Template4, fields: template4Fields },
  paysera: { component: Template8, fields: template8Fields },
  straksbetaling: { component: Template7, fields: template7Fields },
  keksPay: { component: Template3, fields: template3Fields },
  friends24: { component: Template3, fields: template3Fields },
  n26: { component: Template6, fields: template6Fields },
  paylib: { component: Template3, fields: template3Fields },
  lydia: { component: Template3, fields: template3Fields },
  iris: { component: Template3, fields: template3Fields },
  'giftCard.amazon': { component: GiftCardAmazon, fields: template4Fields },
  papara: { component: Template3, fields: template3Fields },
  liquid: { component: Template10, fields: template10Fields },
  lnurl: { component: Template11, fields: template11Fields },
  rappipay: { component: Template12, fields: template12Fields },
  mercadoPago: { component: Template13, fields: template13Fields },
  nequi: { component: Template3, fields: template3Fields },
  cbu: { component: Template14, fields: template7Fields },
  cvu: { component: Template15, fields: template7Fields },
  alias: { component: Template16, fields: template7Fields },
  bancolombia: { component: Template17, fields: template7Fields },
  orangeMoney: { component: Template12, fields: template12Fields },
  moov: { component: Template12, fields: template12Fields },
  wave: { component: Template12, fields: template12Fields },
  airtelMoney: { component: Template12, fields: template12Fields },
  'm-pesa': { component: Template12, fields: template12Fields },
  nationalTransferNG: { component: Template21, fields: template7Fields },
  chippercash: { component: Template18, fields: template18Fields },
  mtn: { component: Template12, fields: template12Fields },
  eversend: { component: Template18, fields: template18Fields },
  payday: { component: Template18, fields: template18Fields },
  sinpe: { component: Template1, fields: template1Fields },
  sinpeMovil: { component: Template3, fields: template3Fields },
  pix: { component: Template22, fields: template22Fields },
  rebellion: { component: Template19, fields: template19Fields },
  klasha: { component: Template19, fields: template19Fields },
  accrue: { component: Template19, fields: template19Fields },
  wirepay: { component: Template19, fields: template19Fields },
  bankera: { component: Template13, fields: template13Fields },
  postePay: { component: Template20, fields: template20Fields },
}
GIFTCARDCOUNTRIES.forEach(
  (c) =>
    (PaymentMethodForms[`giftCard.amazon.${c}`] = {
      component: GiftCardAmazon,
      fields: template4Fields,
    }),
)
NATIONALTRANSFERCOUNTRIES.forEach(
  (c) => (PaymentMethodForms[`nationalTransfer${c}`] = { component: Template9, fields: template9Fields }),
)
