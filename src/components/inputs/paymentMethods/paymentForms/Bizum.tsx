import React from 'react'
import { OnlineWallet } from './OnlineWallet'
import { FormProps } from './PaymentMethodForm'

export const Bizum = (formProps: FormProps) => <OnlineWallet {...formProps} name="bizum" />
