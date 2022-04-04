import { ReactElement } from 'react'
import { IBAN } from './iban'

type PaymentFormProps = ComponentProps & {
  data?: PaymentData,
  onSubmit?: (data: PaymentData) => void,
  onCancel?: () => void,
}
export type PaymentMethodForm = ({ style, onSubmit, onCancel }: PaymentFormProps) => ReactElement

export type PaymentMethodForms = {
  [key in PaymentMethod]: PaymentMethodForm
}
export const PaymentMethodForms: PaymentMethodForms = {
  iban: IBAN,
  paypal: IBAN, // TODO
}