import React from 'react'
import { FormProps } from './PaymentMethodForm'
import { OnlineWallet } from './OnlineWallet'

export const KEKSPay = (formProps: FormProps) => <OnlineWallet {...formProps} name="keksPay" />
