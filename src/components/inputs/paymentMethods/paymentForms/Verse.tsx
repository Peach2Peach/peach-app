import React from 'react'
import { FormProps } from './PaymentMethodForm'
import { OnlineWallet } from './OnlineWallet'

export const Verse = (formProps: FormProps) => <OnlineWallet {...formProps} name="verse" />
