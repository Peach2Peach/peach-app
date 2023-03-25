import React from 'react'
import { FormProps } from './PaymentMethodForm'
import { OnlineWallet } from './OnlineWallet'

export const Vipps = (formProps: FormProps) => <OnlineWallet {...formProps} name="vipps" />
