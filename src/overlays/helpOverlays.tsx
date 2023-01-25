import { ReactElement } from 'react'

import i18n from '../utils/i18n'
import { PayoutAddressPopup } from '../views/settings/components/PayoutAddressPopup'
import { CashTrades } from './CashTrades'
import { FileBackupPopup } from './FileBackupPopup'
import { AddressSigning } from './info/AddressSigning'
import { BuyingAndSelling } from './info/BuyingAndSelling'
import { ConfirmPayment } from './info/ConfirmPayment'
import { CurrenciesHelp } from './info/CurrenciesHelp'
import { Escrow } from './info/Escrow'
import { MakePayment } from './info/MakePayment'
import { Mempool } from './info/Mempool'
import { MyBadges } from './info/MyBadges'
import { PaymentMethodsHelp } from './info/PaymentMethodsHelp'
import { Premium } from './info/Premium'
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
  addressSigning: { title: i18n('help.addressSigning.title'), content: AddressSigning },
  buyingAndSelling: { title: i18n('help.buyingAndSelling.title'), content: BuyingAndSelling },
  cashTrades: { title: i18n('tradingCash'), content: CashTrades },
  confirmPayment: { title: i18n('help.confirmPayment.title'), content: ConfirmPayment },
  currencies: { title: i18n('help.currency.title'), content: CurrenciesHelp },
  escrow: { title: i18n('help.escrow.title'), content: Escrow },
  fileBackup: { title: i18n('settings.backups.fileBackup.popup.title'), content: FileBackupPopup },
  makePayment: { title: i18n('help.makePayment.title'), content: MakePayment },
  mempool: { title: i18n('help.mempool.title'), content: Mempool },
  myBadges: { title: i18n('peachBadges'), content: MyBadges },
  paymentMethods: { title: i18n('settings.paymentMethods'), content: PaymentMethodsHelp },
  payoutAddress: { title: i18n('settings.payoutAddress'), content: PayoutAddressPopup },
  premium: { title: i18n('help.premium.title'), content: Premium },
  referrals: { title: i18n('help.referral.title'), content: ReferralsHelp },
  seedPhrase: { title: i18n('settings.backups.seedPhrase.popup.title'), content: SeedPhrasePopup },
  tradingLimit: { title: i18n('help.tradingLimit.title'), content: TradingLimit },
  useYourOwnNode: { title: i18n('help.useYourOwnNode.title'), content: UseYourOwnNode },
  withdrawingFunds: { title: i18n('wallet.withdraw.help.title'), content: WithdrawingFundsHelp },
  yourPassword: { title: i18n('settings.backups.fileBackup.popup2.title'), content: YourPasswordPopup },
}

export type HelpType = keyof typeof helpOverlays
