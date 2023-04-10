import { GIFTCARDCOUNTRIES, NATIONALTRANSFERCOUNTRIES } from '../../../../constants'
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
  [key in PaymentMethod]?: (props: FormProps) => JSX.Element
}

export const PaymentMethodForms: PaymentMethodFormsType = {
  sepa: Template1,
  fasterPayments: Template5,
  instantSepa: Template1,
  paypal: Template6,
  revolut: Template6,
  vipps: Template3,
  advcash: Template2,
  blik: Template3,
  wise: Template6,
  twint: Template3,
  swish: Template3,
  satispay: Template3,
  mbWay: Template3,
  bizum: Template3,
  mobilePay: Template3,
  skrill: Template4,
  neteller: Template4,
  paysera: Template8,
  straksbetaling: Template7,
  keksPay: Template3,
  friends24: Template3,
  n26: Template3,
  paylib: Template3,
  lydia: Template3,
  verse: Template3,
  iris: Template3,
  'giftCard.amazon': GiftCardAmazon,
}
GIFTCARDCOUNTRIES.forEach((c) => (PaymentMethodForms[('giftCard.amazon.' + c) as PaymentMethod] = GiftCardAmazon))
NATIONALTRANSFERCOUNTRIES.forEach((c) => (PaymentMethodForms[`nationalTransfer${c}` as PaymentMethod] = Template9))
