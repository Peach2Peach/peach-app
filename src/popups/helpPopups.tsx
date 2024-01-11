import i18n from '../utils/i18n'
import { CashTrades } from './info/CashTrades'
import { DisputeDisclaimer } from './info/DisputeDisclaimer'
import { Escrow } from './info/Escrow'
import { LNURLSwaps } from './info/LNURLSwaps'
import { MyBadges } from './info/MyBadges'
import { NetworkFees } from './info/NetworkFees'
import { PaymentMethodsHelp } from './info/PaymentMethodsHelp'
import { ReferralsHelp } from './info/ReferralsHelp'
import { SeedPhrasePopup } from './info/SeedPhrasePopup'
import { WithdrawingFundsHelp } from './info/WithdrawingFundsHelp'
import { YourPassword } from './info/YourPassword'

export const helpPopups: Record<string, { title: string; content: (() => JSX.Element) | string }> = {
  cashTrades: { title: i18n('tradingCash'), content: CashTrades },
  disputeDisclaimer: { title: i18n('trade.chat'), content: DisputeDisclaimer },
  escrow: { title: i18n('help.escrow.title'), content: Escrow },
  lnurl: { title: i18n('help.lnurl.title'), content: LNURLSwaps },
  myBadges: { title: i18n('peachBadges'), content: MyBadges },
  networkFees: { title: i18n('help.networkFees.title'), content: NetworkFees },
  paymentMethods: { title: i18n('settings.paymentMethods'), content: PaymentMethodsHelp },
  referrals: { title: i18n('help.referral.title'), content: ReferralsHelp },
  seedPhrase: { title: i18n('settings.backups.seedPhrase.popup.title'), content: SeedPhrasePopup },
  withdrawingFunds: { title: i18n('wallet.withdraw.help.title'), content: WithdrawingFundsHelp },
  yourPassword: { title: i18n('settings.backups.fileBackup.popup2.title'), content: YourPassword },
}

export type HelpType = keyof typeof helpPopups
