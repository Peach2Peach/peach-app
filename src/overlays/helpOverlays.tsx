import { ReactElement } from 'react'

import i18n from '../utils/i18n'
import { FileBackupPopup } from './FileBackupPopup'
import { CurrenciesHelp } from './info/CurrenciesHelp'
import { MyBadges } from './info/MyBadges'
import { PaymentMethodsHelp } from './info/PaymentMethodsHelp'
import { ReferralsHelp } from './info/ReferralsHelp'
import { SeedPhrasePopup } from './info/SeedPhrasePopup'
import { TradingLimit } from './info/TradingLimit'
import { UseYourOwnNode } from './info/UseYourOwnNode'
import { WithdrawingFundsHelp } from './info/WithdrawingFundsHelp'
import { YourPasswordPopup } from './YourPasswordPopup'

type HelpContent = {
  title: string
  content: () => ReactElement
}

export const helpOverlays: Record<string, HelpContent> = {
  currencies: { title: i18n('help.currency.title'), content: CurrenciesHelp },
  fileBackup: { title: i18n('settings.backups.fileBackup.popup.title'), content: FileBackupPopup },
  myBadges: { title: i18n('peachBadges'), content: MyBadges },
  paymentMethods: { title: i18n('settings.paymentMethods'), content: PaymentMethodsHelp },
  referrals: { title: i18n('help.referral.title'), content: ReferralsHelp },
  seedPhrase: { title: i18n('settings.backups.seedPhrase.popup.title'), content: SeedPhrasePopup },
  tradingLimit: { title: i18n('help.tradingLimit.title'), content: TradingLimit },
  useYourOwnNode: { title: i18n('help.useYourOwnNode.title'), content: UseYourOwnNode },
  withdrawingFunds: { title: i18n('wallet.withdraw.help.title'), content: WithdrawingFundsHelp },
  yourPassword: { title: i18n('settings.backups.fileBackup.popup2.title'), content: YourPasswordPopup },
}

export type HelpType = keyof typeof helpOverlays
