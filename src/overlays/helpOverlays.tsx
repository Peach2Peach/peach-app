import { ReactElement } from 'react'

import i18n from '../utils/i18n'
import { FileBackupPopup } from './FileBackupPopup'
import { AddressSigning } from './info/AddressSigning'
import { BuyingAndSelling } from './info/BuyingAndSelling'
import { CurrenciesHelp } from './info/CurrenciesHelp'
import { MyBadges } from './info/MyBadges'
import { PaymentMethodsHelp } from './info/PaymentMethodsHelp'
import { ReferralsHelp } from './info/ReferralsHelp'
import { SeedPhrasePopup } from './info/SeedPhrasePopup'
import { TradingLimit } from './info/TradingLimit'
import { WithdrawingFundsHelp } from './info/WithdrawingFundsHelp'
import { YourPasswordPopup } from './YourPasswordPopup'

type HelpContent = {
  title: string
  content: () => ReactElement
}

export const helpOverlays: Record<string, HelpContent> = {
  addressSigning: { title: i18n('help.addressSigning.title'), content: AddressSigning },
  paymentMethods: { title: i18n('settings.paymentMethods'), content: PaymentMethodsHelp },
  currencies: { title: i18n('help.currency.title'), content: CurrenciesHelp },
  withdrawingFunds: { title: i18n('wallet.withdraw.help.title'), content: WithdrawingFundsHelp },
  referrals: { title: i18n('help.referral.title'), content: ReferralsHelp },
  tradingLimit: { title: i18n('help.tradingLimit.title'), content: TradingLimit },
  myBadges: { title: i18n('peachBadges'), content: MyBadges },
  seedPhrase: { title: i18n('settings.backups.seedPhrase.popup.title'), content: SeedPhrasePopup },
  fileBackup: { title: i18n('settings.backups.fileBackup.popup.title'), content: FileBackupPopup },
  yourPassword: { title: i18n('settings.backups.fileBackup.popup2.title'), content: YourPasswordPopup },
  buyingAndSelling: { title: i18n('help.buyingAndSelling.title'), content: BuyingAndSelling },
}

export type HelpType = keyof typeof helpOverlays
