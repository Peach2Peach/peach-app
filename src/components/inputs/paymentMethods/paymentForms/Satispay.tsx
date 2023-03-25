import React from 'react'
import { FormProps } from './PaymentMethodForm'
import { OnlineWallet } from './OnlineWallet'

export const Satispay = (formProps: FormProps) => <OnlineWallet {...formProps} name="satispay" />
