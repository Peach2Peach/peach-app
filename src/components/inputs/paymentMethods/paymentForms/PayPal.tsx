import { FormProps } from './PaymentMethodForm'
import { PayPalOrRevolut } from './PayPalOrRevolut'

export const PayPal = (formProps: FormProps) => <PayPalOrRevolut {...formProps} name="paypal" />
