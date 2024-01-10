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
  acceptMatch: { title: i18n('search.popups.acceptMatch.title'), content: i18n('search.popups.acceptMatch.text') },
  cashTrades: { title: i18n('tradingCash'), content: CashTrades },
  confirmationTime: {
    title: i18n('wallet.help.confirmationTime.title'),
    content: i18n('wallet.help.confirmationTime.description'),
  },
  coinControl: { title: i18n('wallet.coinControl.help.title'), content: i18n('wallet.coinControl.help.description') },
  currencies: { title: i18n('help.currency.title'), content: i18n('help.currency.description') },
  disputeDisclaimer: { title: i18n('trade.chat'), content: DisputeDisclaimer },
  escrow: { title: i18n('help.escrow.title'), content: Escrow },
  fileBackup: {
    title: i18n('settings.backups.fileBackup.popup.title'),
    content: i18n('settings.backups.fileBackup.popup.content'),
  },
  lnurl: { title: i18n('help.lnurl.title'), content: LNURLSwaps },
  matchmatchmatch: {
    title: i18n('search.popups.matchmatchmatch.title'),
    content: i18n('search.popups.matchmatchmatch.text'),
  },
  myBadges: { title: i18n('peachBadges'), content: MyBadges },
  networkFees: { title: i18n('help.networkFees.title'), content: NetworkFees },
  paymentMethods: { title: i18n('settings.paymentMethods'), content: PaymentMethodsHelp },
  rbf: { title: i18n('wallet.bumpNetworkFees.help.title'), content: i18n('wallet.bumpNetworkFees.description') },
  referrals: { title: i18n('help.referral.title'), content: ReferralsHelp },
  seedPhrase: { title: i18n('settings.backups.seedPhrase.popup.title'), content: SeedPhrasePopup },
  useYourOwnNode: { title: i18n('wallet.settings.node.help.title'), content: i18n('wallet.settings.node.help.text') },
  withdrawingFunds: { title: i18n('wallet.withdraw.help.title'), content: WithdrawingFundsHelp },
  yourPassword: { title: i18n('settings.backups.fileBackup.popup2.title'), content: YourPassword },
}

export type HelpType = keyof typeof helpPopups
