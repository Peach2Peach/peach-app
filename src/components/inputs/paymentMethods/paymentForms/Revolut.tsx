import { FormProps } from './PaymentMethodForm'
import { PayPalOrRevolut } from './PayPalOrRevolut'

export const Revolut = (formProps: FormProps) => <PayPalOrRevolut {...formProps} name="revolut" />
