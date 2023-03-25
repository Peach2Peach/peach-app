import React from 'react'
import { FormProps } from './PaymentMethodForm'
import { OnlineWallet } from './OnlineWallet'

export const N26 = (formProps: FormProps) => <OnlineWallet {...formProps} name="n26" />
