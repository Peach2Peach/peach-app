import { ReactElement } from 'react'
import { GIFTCARDCOUNTRIES, NATIONALTRANSFERCOUNTRIES } from '../../../../constants'
import { ADVCash } from './ADVCash'
import { Bizum } from './Bizum'
import { Blik } from './Blik'
import { FasterPayments } from './FasterPayments'
import { GiftCardAmazon } from './giftCard.amazon'
import { InstantSepa } from './InstantSepa'
import { MBWay } from './MBWay'
import { MobilePay } from './MobilePay'
import { NationalTransfer } from './NationalTransfer'
import { FormProps } from './PaymentMethodForm'
import { PayPal } from './PayPal'
import { Revolut } from './Revolut'
import { Satispay } from './Satispay'
import { SEPA } from './SEPA'
import { Swish } from './Swish'
import { Twint } from './Twint'
import { Vipps } from './Vipps'
import { Wise } from './Wise'
import { Skrill } from './Skrill'
import { Neteller } from './Neteller'
import { Paysera } from './Paysera'
import { Straksbetaling } from './Straksbetaling'
import { KEKSPay } from './KEKSPay'
import { Friends24 } from './Friends24'
import { N26 } from './N26'
import { Paylib } from './Paylib'
export { PaymentMethodForm } from './PaymentMethodForm'

type PaymentMethodFormType = (props: FormProps) => ReactElement
export type PaymentMethodForms = {
  [key in PaymentMethod]?: PaymentMethodFormType
}

export const PaymentMethodForms: PaymentMethodForms = {
  sepa: SEPA,
  fasterPayments: FasterPayments,
  instantSepa: InstantSepa,
  paypal: PayPal,
  revolut: Revolut,
  vipps: Vipps,
  advcash: ADVCash,
  blik: Blik,
  wise: Wise,
  twint: Twint,
  swish: Swish,
  satispay: Satispay,
  mbWay: MBWay,
  bizum: Bizum,
  mobilePay: MobilePay,
  skrill: Skrill,
  neteller: Neteller,
  paysera: Paysera,
  straksbetaling: Straksbetaling,
  keksPay: KEKSPay,
  friends24: Friends24,
  n26: N26,
  paylib: Paylib,
  'giftCard.amazon': GiftCardAmazon,
}
GIFTCARDCOUNTRIES.forEach((c) => (PaymentMethodForms[('giftCard.amazon.' + c) as PaymentMethod] = GiftCardAmazon))
NATIONALTRANSFERCOUNTRIES.forEach(
  (c) => (PaymentMethodForms[`nationalTransfer${c}` as PaymentMethod] = NationalTransfer),
)
