import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Icon, Text } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { CurrenciesHelp } from './info/CurrenciesHelp'
import { PaymentMethodsHelp } from './info/PaymentMethodsHelp'
import { WithdrawingFundsHelp } from './info/WithdrawingFundsHelp'

type HelpContent = {
  title: string
  content: ReactElement
}

export const helpOverlays: Record<string, HelpContent> = {
  paymentMethods: {
    title: i18n('settings.paymentMethods'),
    content: PaymentMethodsHelp,
  },
  currencies: {
    title: i18n('help.currency.title'),
    content: CurrenciesHelp,
  },
  withdrawingFunds: {
    title: i18n('wallet.withdraw.help.title'),
    content: WithdrawingFundsHelp,
  },
}

export type HelpType = keyof typeof helpOverlays
