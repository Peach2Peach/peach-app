import React from 'react'
import { FormProps } from './PaymentMethodForm'
import { PaymentMethodForm1 } from './PaymentMethodForm1'

export const SEPA = (formProps: FormProps) => <PaymentMethodForm1 {...formProps} name="sepa" />
