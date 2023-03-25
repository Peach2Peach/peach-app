import React from 'react'
import { FormProps } from './PaymentMethodForm'
import { SkrillOrNeteller } from './SkrillOrNeteller'

export const Skrill = (formProps: FormProps) => <SkrillOrNeteller {...formProps} name="neteller" />
