import { ReactElement } from 'react'
import { SEPA } from './SEPA'
import { PayPal } from './PayPal'
// import { GiftCard } from './GiftCard'
import { Revolut } from './Revolut'
import { ApplePay } from './ApplePay'
import { Wise } from './Wise'
import { BankTranserUK } from './BankTranserUK'

type PaymentFormProps = ComponentProps & {
  data?: PaymentData,
  view: 'new' | 'edit' | 'view',
  onSubmit?: (data?: PaymentData) => void,
  onCancel?: () => void,
}
export type PaymentMethodForm = ({ style, view, onSubmit, onCancel }: PaymentFormProps) => ReactElement

export type PaymentMethodForms = {
  [key in PaymentMethod]?: PaymentMethodForm
}
export const PaymentMethodForms: PaymentMethodForms = {
  sepa: SEPA,
  bankTransferCH: SEPA,
  bankTransferUK: BankTranserUK,
  paypal: PayPal,
  revolut: Revolut,
  applePay: ApplePay,
  wise: Wise,
  twint: SEPA,
  swish: SEPA,
  mbWay: SEPA,
  bizum: SEPA,
  tether: SEPA,
  // giftCard: GiftCard,
  // revolut: Revolut,
  // applePay: ApplePay,
}