import React from 'react'
import { FormProps } from './PaymentMethodForm'
import { OnlineWallet } from './OnlineWallet'

export const Swish = (formProps: FormProps) => <OnlineWallet {...formProps} name="swish" />
