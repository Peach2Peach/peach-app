import { ReactElement } from 'react'
import i18n from '../utils/i18n'
import { CurrenciesHelp } from './info/CurrenciesHelp'
import { PaymentMethodsHelp } from './info/PaymentMethodsHelp'
import { ReferralsHelp } from './info/ReferralsHelp'
import { WithdrawingFundsHelp } from './info/WithdrawingFundsHelp'
import { MyBadges } from './info/MyBadges'
import { TradingLimit } from './info/TradingLimit'

type HelpContent = {
  title: string
  content: () => ReactElement
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
  referrals: {
    title: i18n('help.referral.title'),
    content: ReferralsHelp,
  },
  tradingLimit: {
    title: i18n('help.tradingLimit.title'),
    content: TradingLimit,
  },
  myBadges: {
    title: i18n('peachBadges'),
    content: MyBadges,
  },
}

export type HelpType = keyof typeof helpOverlays
