import React, { ReactElement } from 'react'
import { FormProps } from './PaymentMethodForm'
import { OnlineWallet } from './OnlineWallet'

export const Blik = (formProps: FormProps): ReactElement => <OnlineWallet {...formProps} name="blik" />
