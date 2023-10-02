import { BackgroundConfig } from '../components/background/Background'
import { MeetupScreen } from '../components/payment/MeetupScreen'
import { PaymentMethods } from '../components/payment/PaymentMethods'
import { PaymentMethodForm } from './addPaymentMethod/PaymentMethodForm'
import { SelectCountry } from './addPaymentMethod/SelectCountry'
import { SelectCurrency } from './addPaymentMethod/SelectCurrency'
import { SelectPaymentMethod } from './addPaymentMethod/SelectPaymentMethod'
import { BackupTime } from './backupTime/BackupTime'
import { Buy } from './buy/Buy'
import { BuySummary } from './buy/BuySummary'
import { SignMessage } from './buy/SignMessage'
import { Contact } from './contact/Contact'
import { Contract } from './contract/Contract'
import { PaymentMade } from './contract/PaymentMade'
import { ContractChat } from './contractChat/ContractChat'
import { DisputeForm } from './dispute/DisputeForm'
import { DisputeReasonSelector } from './dispute/DisputeReasonSelector'
import { FundEscrow } from './fundEscrow/FundEscrow'
import { NewUser } from './newUser/NewUser'
import { OfferDetails } from './offerDetails/OfferDetails'
import { GroupHugAnnouncement } from './overlays/GroupHugAnnouncement'
import { NewBadge } from './overlays/NewBadge'
import { PublicProfile } from './publicProfile/PublicProfile'
import { Referrals } from './referrals/Referrals'
import { Report } from './report/Report'
import { RestoreBackup } from './restoreBackup/RestoreBackup'
import { RestoreReputation } from './restoreReputation/RestoreReputation'
import { EditPremium } from './search/EditPremium'
import { OfferPublished } from './search/OfferPublished'
import { Search } from './search/Search'
import { SelectWallet } from './selectWallet/SelectWallet'
import { OfferPreferencePremium } from './sell/OfferPreferencePremium'
import { Sell } from './sell/Sell'
import { SellSummary } from './sell/SellSummary'
import { AboutPeach } from './settings/aboutPeach/AboutPeach'
import { BitcoinProducts } from './settings/aboutPeach/BitcoinProducts'
import { PeachFees } from './settings/aboutPeach/PeachFees'
import { Socials } from './settings/aboutPeach/Socials'
import { Backups } from './settings/Backups'
import { BackupCreated } from './settings/components/backups/BackupCreated'
import { Currency } from './settings/Currency'
import { Language } from './settings/Language'
import { NetworkFees } from './settings/NetworkFees'
import { PayoutAddress } from './settings/PayoutAddress'
import { MyProfile } from './settings/profile/MyProfile'
import { Settings } from './settings/Settings'
import { TransactionBatching } from './settings/TransactionBatching'
import { TestViewButtons } from './TestView/buttons'
import { TestViewComponents } from './TestView/components'
import { TestViewMessages } from './TestView/messages'
import { TestViewPeachWallet } from './TestView/peachWallet'
import { TestViewPNs } from './TestView/pns'
import { TestViewPopups } from './TestView/popups'
import { TestView } from './TestView/TestView'
import { TradeComplete } from './tradeComplete/TradeComplete'
import { AddressChecker } from './wallet/AddressChecker'
import { BumpNetworkFees } from './wallet/BumpNetworkFees'
import { CoinSelection } from './wallet/CoinSelection'
import { ExportTransactionHistory } from './wallet/ExportTransactionHistory'
import { ReceiveBitcoin } from './wallet/ReceiveBitcoin'
import { SendBitcoin } from './wallet/SendBitcoin'
import { TransactionDetails } from './wallet/TransactionDetails'
import { TransactionHistory } from './wallet/TransactionHistory'
import { Wallet } from './wallet/Wallet'
import { Welcome } from './welcome/Welcome'
import { WrongFundingAmount } from './wrongFundingAmount/WrongFundingAmount'
import { ExportTradeHistory } from './yourTrades/ExportTradeHistory'
import { YourTrades } from './yourTrades/YourTrades'

type ViewType = {
  name: keyof RootStackParamList
  component: () => JSX.Element
  showHeader: boolean
  showFooter: boolean
  background: BackgroundConfig
  animationEnabled: boolean
}

const onboardingConfig = {
  showHeader: true,
  showFooter: false,
  background: { color: 'primaryGradient' },
  animationEnabled: false,
} as const
const defaultConfig = { showHeader: true, showFooter: true, background: { color: undefined }, animationEnabled: true }
const invertedThemeConfig = {
  showHeader: false,
  showFooter: false,
  background: { color: 'primaryGradient' },
  animationEnabled: false,
} as const

const onboarding: ViewType[] = [
  { name: 'welcome', component: Welcome, ...onboardingConfig },
  { name: 'home', component: Welcome, ...onboardingConfig },
  { name: 'newUser', component: NewUser, ...onboardingConfig },
  { name: 'restoreBackup', component: RestoreBackup, ...onboardingConfig },
  { name: 'restoreReputation', component: RestoreReputation, ...onboardingConfig },
]

const home: ViewType[] = [{ name: 'home', component: Buy, ...defaultConfig }]

const wallet: ViewType[] = [
  { name: 'wallet', component: Wallet, ...defaultConfig, showHeader: false, animationEnabled: false },
  { name: 'sendBitcoin', component: SendBitcoin, ...defaultConfig, showHeader: false },
  { name: 'receiveBitcoin', component: ReceiveBitcoin, ...defaultConfig, showHeader: false },
  { name: 'addressChecker', component: AddressChecker, ...defaultConfig, showHeader: false },
  { name: 'coinSelection', component: CoinSelection, ...defaultConfig, showHeader: false },
  { name: 'transactionHistory', component: TransactionHistory, ...defaultConfig, showHeader: false },
  { name: 'exportTransactionHistory', component: ExportTransactionHistory, ...defaultConfig, showHeader: false },
  { name: 'transactionDetails', component: TransactionDetails, ...defaultConfig },
  { name: 'bumpNetworkFees', component: BumpNetworkFees, ...defaultConfig },
]
const buyFlow: ViewType[] = [
  { name: 'buy', component: Buy, ...defaultConfig, animationEnabled: false },
  { name: 'buyPreferences', component: PaymentMethods, ...defaultConfig },
  { name: 'buySummary', component: BuySummary, ...defaultConfig, showHeader: false },
  { name: 'signMessage', component: SignMessage, ...defaultConfig },
]

const sellFlow: ViewType[] = [
  { name: 'sell', component: Sell, ...defaultConfig, animationEnabled: false },
  { name: 'premium', component: OfferPreferencePremium, ...defaultConfig },
  { name: 'sellPreferences', component: PaymentMethods, ...defaultConfig },
  { name: 'sellSummary', component: SellSummary, ...defaultConfig },
  { name: 'fundEscrow', component: FundEscrow, ...defaultConfig },
  { name: 'wrongFundingAmount', component: WrongFundingAmount, ...defaultConfig },
  { name: 'selectWallet', component: SelectWallet, ...defaultConfig },
]

const search: ViewType[] = [
  { name: 'search', component: Search, ...defaultConfig },
  { name: 'editPremium', component: EditPremium, ...defaultConfig },
]

const trade: ViewType[] = [
  { name: 'contract', component: Contract, ...defaultConfig },
  { name: 'contractChat', component: ContractChat, ...defaultConfig },
  { name: 'paymentMade', component: PaymentMade, ...invertedThemeConfig },
  { name: 'tradeComplete', component: TradeComplete, ...invertedThemeConfig },
]

const tradeHistory: ViewType[] = [
  { name: 'yourTrades', component: YourTrades, ...defaultConfig, animationEnabled: false, showHeader: false },
  { name: 'offer', component: OfferDetails, ...defaultConfig },
  { name: 'exportTradeHistory', component: ExportTradeHistory, ...defaultConfig, showHeader: false },
]

const contact = (hasAccount: boolean): ViewType[] =>
  hasAccount
    ? [
      { name: 'contact', component: Contact, ...defaultConfig, showFooter: hasAccount, showHeader: false },
      { name: 'report', component: Report, ...defaultConfig, showFooter: hasAccount },
      { name: 'disputeReasonSelector', component: DisputeReasonSelector, ...defaultConfig },
      { name: 'disputeForm', component: DisputeForm, ...defaultConfig },
    ]
    : [
      { name: 'contact', component: Contact, ...defaultConfig, showFooter: false, showHeader: false },
      { name: 'report', component: Report, ...defaultConfig, showFooter: false },
    ]

const publicProfile: ViewType[] = [
  {
    name: 'publicProfile',
    component: PublicProfile,
    ...defaultConfig,
    showHeader: false,
  },
]

const overlays: ViewType[] = [
  { name: 'offerPublished', component: OfferPublished, ...invertedThemeConfig },
  { name: 'groupHugAnnouncement', component: GroupHugAnnouncement, ...invertedThemeConfig },
  { name: 'newBadge', component: NewBadge, ...invertedThemeConfig },
]

const settings: ViewType[] = [
  { name: 'settings', component: Settings, ...defaultConfig, animationEnabled: false },
  { name: 'aboutPeach', component: AboutPeach, ...defaultConfig, showHeader: false },
  { name: 'myProfile', component: MyProfile, ...defaultConfig, showHeader: false },
  { name: 'bitcoinProducts', component: BitcoinProducts, ...defaultConfig },
  { name: 'selectCurrency', component: SelectCurrency, ...defaultConfig, showHeader: false },
  { name: 'selectPaymentMethod', component: SelectPaymentMethod, ...defaultConfig },
  { name: 'selectCountry', component: SelectCountry, ...defaultConfig, showHeader: false },
  { name: 'paymentMethodForm', component: PaymentMethodForm, ...defaultConfig },
  { name: 'meetupScreen', component: MeetupScreen, ...defaultConfig },
  { name: 'currency', component: Currency, ...defaultConfig },
  { name: 'language', component: Language, ...defaultConfig },
  { name: 'referrals', component: Referrals, ...defaultConfig },
  { name: 'backupTime', component: BackupTime, ...invertedThemeConfig, showFooter: true },
  { name: 'backups', component: Backups, ...defaultConfig },
  { name: 'backupCreated', component: BackupCreated, ...invertedThemeConfig },
  { name: 'payoutAddress', component: PayoutAddress, ...defaultConfig },
  { name: 'paymentMethods', component: PaymentMethods, ...defaultConfig },
  { name: 'peachFees', component: PeachFees, ...defaultConfig },
  { name: 'networkFees', component: NetworkFees, ...defaultConfig },
  { name: 'transactionBatching', component: TransactionBatching, ...defaultConfig },
  { name: 'socials', component: Socials, ...defaultConfig, showHeader: false },
]

const testViews: ViewType[] = [
  { name: 'testView', component: TestView, ...defaultConfig },
  { name: 'testViewPeachWallet', component: TestViewPeachWallet, ...defaultConfig },
  { name: 'testViewButtons', component: TestViewButtons, ...defaultConfig },
  { name: 'testViewPopups', component: TestViewPopups, ...defaultConfig },
  { name: 'testViewMessages', component: TestViewMessages, ...defaultConfig },
  { name: 'testViewComponents', component: TestViewComponents, ...defaultConfig },
  { name: 'testViewPNs', component: TestViewPNs, ...defaultConfig },
]

export const getViews = (hasAccount: boolean): ViewType[] =>
  hasAccount
    ? [
      ...home,
      ...wallet,
      ...buyFlow,
      ...sellFlow,
      ...search,
      ...trade,
      ...tradeHistory,
      ...publicProfile,
      ...contact(hasAccount),
      ...settings,
      ...overlays,
      ...testViews,
    ]
    : [...onboarding, ...contact(hasAccount)]
