import { GIFTCARDCOUNTRIES, NATIONALTRANSFERCOUNTRIES } from '../../../../constants'
import { TradeInformationField } from '../../../offer/TradeInformation'
import {
  Template1,
  Template2,
  Template3,
  Template4,
  Template5,
  Template6,
  Template7,
  Template8,
  Template9,
} from '../templates'
import { GiftCardAmazon } from './GiftCardAmazon'
import { FormProps } from './PaymentMethodForm'

type PaymentMethodFormsType = {
  [key in PaymentMethod]?: { component: (props: FormProps) => JSX.Element; fields: TradeInformationField[] }
}

const template1Fields: TradeInformationField[] = ['price', 'name', 'iban', 'bic', 'reference']
const template2Fields: TradeInformationField[] = []
const template3Fields: TradeInformationField[] = []
const template4Fields: TradeInformationField[] = []
const template5Fields: TradeInformationField[] = []
const template6Fields: TradeInformationField[] = ['price', 'phone', 'userName', 'email', 'reference']
const template7Fields: TradeInformationField[] = []
const template8Fields: TradeInformationField[] = []
const template9Fields: TradeInformationField[] = []

export const PaymentMethodForms: PaymentMethodFormsType = {
  sepa: { component: Template1, fields: [] },
  fasterPayments: { component: Template5, fields: [] },
  instantSepa: { component: Template1, fields: [] },
  paypal: { component: Template6, fields: template6Fields },
  revolut: { component: Template6, fields: template6Fields },
  vipps: { component: Template3, fields: [] },
  advcash: { component: Template2, fields: [] },
  blik: { component: Template3, fields: [] },
  wise: { component: Template6, fields: template6Fields },
  twint: { component: Template3, fields: [] },
  swish: { component: Template3, fields: [] },
  satispay: { component: Template3, fields: [] },
  mbWay: { component: Template3, fields: [] },
  bizum: { component: Template3, fields: [] },
  mobilePay: { component: Template3, fields: [] },
  skrill: { component: Template4, fields: [] },
  neteller: { component: Template4, fields: [] },
  paysera: { component: Template8, fields: [] },
  straksbetaling: { component: Template7, fields: [] },
  keksPay: { component: Template3, fields: [] },
  friends24: { component: Template3, fields: [] },
  n26: { component: Template3, fields: [] },
  paylib: { component: Template3, fields: [] },
  lydia: { component: Template3, fields: [] },
  verse: { component: Template3, fields: [] },
  iris: { component: Template3, fields: [] },
  // why isn't this template 4??
  'giftCard.amazon': { component: GiftCardAmazon, fields: [] },
}
GIFTCARDCOUNTRIES.forEach(
  (c) => (PaymentMethodForms[('giftCard.amazon.' + c) as PaymentMethod] = { component: GiftCardAmazon, fields: [] }),
)
NATIONALTRANSFERCOUNTRIES.forEach(
  (c) => (PaymentMethodForms[`nationalTransfer${c}` as PaymentMethod] = { component: Template9, fields: [] }),
)
