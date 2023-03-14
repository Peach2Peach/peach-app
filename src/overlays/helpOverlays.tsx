import i18n from '../utils/i18n'
import { PayoutAddressPopup } from '../views/settings/components/PayoutAddressPopup'
import { AcceptMatchPopup } from './AcceptMatchPopup'
import { CashTrades } from './CashTrades'
import { FileBackupPopup } from './FileBackupPopup'
import { AddressSigning } from './info/AddressSigning'
import { BuyingAndSelling } from './info/BuyingAndSelling'
import { BuyingBitcoin } from './info/BuyingBitcoin'
import { ConfirmPayment } from './info/ConfirmPayment'
import { CurrenciesHelp } from './info/CurrenciesHelp'
import { Escrow } from './info/Escrow'
import { MakePayment } from './info/MakePayment'
import { MatchMatchMatch } from './info/MatchMatchMatch'
import { Mempool } from './info/Mempool'
import { MyBadges } from './info/MyBadges'
import { NetworkFees } from './info/NetworkFees'
import { PaymentMethodsHelp } from './info/PaymentMethodsHelp'
import { Premium } from './info/Premium'
import { ReferralsHelp } from './info/ReferralsHelp'
import { SeedPhrasePopup } from './info/SeedPhrasePopup'
import { TradingLimit } from './info/TradingLimit'
import { WithdrawingFundsHelp } from './info/WithdrawingFundsHelp'
import { YourPassword } from './info/YourPassword'

export const helpOverlays = {
  addressSigning: { title: i18n('help.addressSigning.title'), content: AddressSigning },
  acceptMatch: { title: i18n('search.popups.acceptMatch.title'), content: AcceptMatchPopup },
  buyingAndSelling: { title: i18n('help.buyingAndSelling.title'), content: BuyingAndSelling },
  buyingBitcoin: { title: i18n('help.buyingBitcoin.title'), content: BuyingBitcoin },
  cashTrades: { title: i18n('tradingCash'), content: CashTrades },
  confirmPayment: { title: i18n('help.confirmPayment.title'), content: ConfirmPayment },
  currencies: { title: i18n('help.currency.title'), content: CurrenciesHelp },
  escrow: { title: i18n('help.escrow.title'), content: Escrow },
  fileBackup: { title: i18n('settings.backups.fileBackup.popup.title'), content: FileBackupPopup },
  matchmatchmatch: { title: i18n('search.popups.matchmatchmatch.title'), content: MatchMatchMatch },
  makePayment: { title: i18n('help.makePayment.title'), content: MakePayment },
  mempool: { title: i18n('help.mempool.title'), content: Mempool },
  myBadges: { title: i18n('peachBadges'), content: MyBadges },
  networkFees: { title: i18n('help.networkFees.title'), content: NetworkFees },
  paymentMethods: { title: i18n('settings.paymentMethods'), content: PaymentMethodsHelp },
  payoutAddress: { title: i18n('settings.payoutAddress'), content: PayoutAddressPopup },
  premium: { title: i18n('help.premium.title'), content: Premium },
  referrals: { title: i18n('help.referral.title'), content: ReferralsHelp },
  seedPhrase: { title: i18n('settings.backups.seedPhrase.popup.title'), content: SeedPhrasePopup },
  tradingLimit: { title: i18n('help.tradingLimit.title'), content: TradingLimit },
  withdrawingFunds: { title: i18n('wallet.withdraw.help.title'), content: WithdrawingFundsHelp },
  yourPassword: { title: i18n('settings.backups.fileBackup.popup2.title'), content: YourPassword },
}

export type HelpType = keyof typeof helpOverlays
