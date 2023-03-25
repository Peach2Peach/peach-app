import React from 'react'
import { FormProps } from './PaymentMethodForm'
import { OnlineWallet } from './OnlineWallet'

export const Twint = (formProps: FormProps) => <OnlineWallet {...formProps} name="twint" />
