import { ReactElement } from 'react'
import { IBAN } from './IBAN'
import { PayPal } from './PayPal'
import { GiftCard } from './GiftCard'
import { Revolut } from './Revolut'
import { ApplePay } from './ApplePay'

type PaymentFormProps = ComponentProps & {
  data?: PaymentData,
  onSubmit?: (data: PaymentData) => void,
  onCancel?: () => void,
}
export type PaymentMethodForm = ({ style, onSubmit, onCancel }: PaymentFormProps) => ReactElement

export type PaymentMethodForms = {
  [key in PaymentMethod]?: PaymentMethodForm
}
export const PaymentMethodForms: PaymentMethodForms = {
  iban: IBAN,
  paypal: PayPal,
  // giftCard: GiftCard,
  // revolut: Revolut,
  // applePay: ApplePay,
}