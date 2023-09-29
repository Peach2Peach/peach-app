import i18n from '../utils/i18n'
import { AcceptMatchPopup } from './info/AcceptMatchPopup'
import { CashTrades } from './info/CashTrades'
import { CoinControl } from './info/CoinControl'
import { ConfirmationTime } from './info/ConfirmationTime'
import { CurrenciesHelp } from './info/CurrenciesHelp'
import { Escrow } from './info/Escrow'
import { FileBackupPopup } from './info/FileBackupPopup'
import { LNURLSwaps } from './info/LNURLSwaps'
import { MatchMatchMatch } from './info/MatchMatchMatch'
import { MyBadges } from './info/MyBadges'
import { NetworkFees } from './info/NetworkFees'
import { PaymentMethodForbiddenPaypal } from './info/PaymentMethodForbiddenPaypal'
import { PaymentMethodsHelp } from './info/PaymentMethodsHelp'
import { PayoutAddressPopup } from './info/PayoutAddressPopup'
import { RBFHelp } from './info/RBFHelp'
import { ReferralsHelp } from './info/ReferralsHelp'
import { SeedPhrasePopup } from './info/SeedPhrasePopup'
import { WithdrawingFundsHelp } from './info/WithdrawingFundsHelp'
import { YourPassword } from './info/YourPassword'

export const helpPopups: Record<string, { title: string; content: () => JSX.Element }> = {
  acceptMatch: { title: i18n('search.popups.acceptMatch.title'), content: AcceptMatchPopup },
  cashTrades: { title: i18n('tradingCash'), content: CashTrades },
  confirmationTime: { title: i18n('wallet.help.confirmationTime.title'), content: ConfirmationTime },
  coinControl: { title: i18n('wallet.coinControl.help.title'), content: CoinControl },
  currencies: { title: i18n('help.currency.title'), content: CurrenciesHelp },
  escrow: { title: i18n('help.escrow.title'), content: Escrow },
  fileBackup: { title: i18n('settings.backups.fileBackup.popup.title'), content: FileBackupPopup },
  lnurl: { title: i18n('help.lnurl.title'), content: LNURLSwaps },
  matchmatchmatch: { title: i18n('search.popups.matchmatchmatch.title'), content: MatchMatchMatch },
  myBadges: { title: i18n('peachBadges'), content: MyBadges },
  networkFees: { title: i18n('help.networkFees.title'), content: NetworkFees },
  'paymentMethodForbidden.paypal': { title: '', content: PaymentMethodForbiddenPaypal },
  paymentMethods: { title: i18n('settings.paymentMethods'), content: PaymentMethodsHelp },
  payoutAddress: { title: i18n('settings.payoutAddress'), content: PayoutAddressPopup },
  rbf: { title: i18n('wallet.bumpNetworkFees.help.title'), content: RBFHelp },
  referrals: { title: i18n('help.referral.title'), content: ReferralsHelp },
  seedPhrase: { title: i18n('settings.backups.seedPhrase.popup.title'), content: SeedPhrasePopup },
  withdrawingFunds: { title: i18n('wallet.withdraw.help.title'), content: WithdrawingFundsHelp },
  yourPassword: { title: i18n('settings.backups.fileBackup.popup2.title'), content: YourPassword },
}

export type HelpType = keyof typeof helpPopups
