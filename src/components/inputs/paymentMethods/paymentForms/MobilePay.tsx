import React from 'react'
import { OnlineWallet } from './OnlineWallet'
import { FormProps } from './PaymentMethodForm'

export const MobilePay = (formProps: FormProps) => <OnlineWallet {...formProps} name="mobilePay" />
