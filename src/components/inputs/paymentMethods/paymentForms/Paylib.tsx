import React from 'react'
import { FormProps } from './PaymentMethodForm'
import { OnlineWallet } from './OnlineWallet'

export const Paylib = (formProps: FormProps) => <OnlineWallet {...formProps} name="paylib" />
