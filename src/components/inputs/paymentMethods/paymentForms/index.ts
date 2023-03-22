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
  'giftCard.amazon': GiftCardAmazon,
}
GIFTCARDCOUNTRIES.forEach((c) => (PaymentMethodForms[('giftCard.amazon.' + c) as PaymentMethod] = GiftCardAmazon))
NATIONALTRANSFERCOUNTRIES.forEach(
  (c) => (PaymentMethodForms[`nationalTransfer${c}` as PaymentMethod] = NationalTransfer),
)
