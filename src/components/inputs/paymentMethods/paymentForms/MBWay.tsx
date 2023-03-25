import React from 'react'
import { OnlineWallet } from './OnlineWallet'
import { FormProps } from './PaymentMethodForm'

export const MBWay = (formProps: FormProps) => <OnlineWallet {...formProps} name="mbWay" />
