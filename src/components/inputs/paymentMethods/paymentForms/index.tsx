import { ReactElement } from 'react'
import { SEPA } from './SEPA'
import { PayPal } from './PayPal'
import { GiftCard } from './GiftCard'
import { Revolut } from './Revolut'
import { ApplePay } from './ApplePay'

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
  paypal: PayPal,
  // giftCard: GiftCard,
  // revolut: Revolut,
  // applePay: ApplePay,
}