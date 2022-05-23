import { ReactElement } from 'react'
import { SEPA } from './SEPA'
import { PayPal } from './PayPal'
import { Revolut } from './Revolut'
import { ApplePay } from './ApplePay'
// import { Wise } from './Wise'
import { BankTransferCH } from './BankTransferCH'
import { BankTransferUK } from './BankTransferUK'
import { Twint } from './Twint'
import { Bizum } from './Bizum'
import { Swish } from './Swish'
import { MBWay } from './MBWay'
// import { Tether } from './Tether'

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
  bankTransferCH: BankTransferCH,
  bankTransferUK: BankTransferUK,
  paypal: PayPal,
  revolut: Revolut,
  applePay: ApplePay,
  // wise: Wise,
  twint: Twint,
  swish: Swish,
  mbWay: MBWay,
  bizum: Bizum,
  // tether: Tether,
}