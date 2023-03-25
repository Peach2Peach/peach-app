import React from 'react'
import { FormProps } from './PaymentMethodForm'
import { OnlineWallet } from './OnlineWallet'

export const Iris = (formProps: FormProps) => <OnlineWallet {...formProps} name="iris" />
