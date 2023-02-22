import { ReactElement } from 'react'

import { BackgroundConfig } from '../components/background/Background'
import MeetupScreen from '../components/payment/MeetupScreen'
import AddPaymentMethod from './addPaymentMethod/AddPaymentMethod'
import PaymentDetails from './addPaymentMethod/PaymentDetails'
import BackupTime from './backupTime/BackupTime'
import Buy from './buy/Buy'
import BuyPreferences from './buy/BuyPreferences'
import SignMessage from './buy/SignMessage'
import Contact from './contact/Contact'
import Contract from './contract/Contract'
import PaymentMade from './contract/PaymentMade'
import ContractChat from './contractChat/ContractChat'
import DisputeForm from './dispute/DisputeForm'
import DisputeReasonSelector from './dispute/DisputeReasonSelector'
import NewUser from './newUser/NewUser'
import OfferDetails from './offerDetails/OfferDetails'
import PublicProfile from './publicProfile/PublicProfile'
import Referrals from './referrals/Referrals'
import Report from './report/Report'
import RestoreBackup from './restoreBackup/RestoreBackup'
import OfferPublished from './search/OfferPublished'
import Search from './search/Search'
import SelectWallet from './selectWallet/SelectWallet'
import SetRefundWallet from './selectWallet/SetRefundWallet'
import FundEscrow from './sell/FundEscrow'
import Sell from './sell/Sell'
import SellPreferences from './sell/SellPreferences'
import AboutPeach from './settings/aboutPeach/AboutPeach'
import BitcoinProducts from './settings/aboutPeach/BitcoinProducts'
import PeachFees from './settings/aboutPeach/PeachFees'
import Socials from './settings/aboutPeach/Socials'
import Backups from './settings/Backups'
import BackupCreated from './settings/components/backups/BackupCreated'
import Currency from './settings/Currency'
import NetworkFees from './settings/NetworkFees'
import PaymentMethods from './settings/PaymentMethods'
import PayoutAddress from './settings/PayoutAddress'
import MyProfile from './settings/profile/MyProfile'
import Settings from './settings/Settings'
import TestViewButtons from './TestView/buttons'
import TestViewComponents from './TestView/components'
import TestViewMessages from './TestView/messages'
import TestViewPopups from './TestView/popups'
import TestView from './TestView/TestView'
import TradeComplete from './tradeComplete/TradeComplete'
import TransactionDetails from './wallet/TransactionDetails'
import TransactionHistory from './wallet/TransactionHistory'
import Wallet from './wallet/Wallet'
import Welcome from './welcome/Welcome'
import YourTrades from './yourTrades/YourTrades'

type ViewType = {
  name: keyof RootStackParamList
  component: (props: any) => ReactElement
  showHeader: boolean
  showFooter: boolean
  background: BackgroundConfig
}

const onboardingConfig = { showHeader: true, showFooter: false, background: { color: 'primaryGradient' } } as const
const defaultConfig = { showHeader: true, showFooter: true, background: { color: undefined } }
const invertedThemeConfig = { showHeader: false, showFooter: false, background: { color: 'primaryGradient' } } as const

const onboarding: ViewType[] = [
  { name: 'welcome', component: Welcome, ...onboardingConfig },
  { name: 'home', component: Welcome, ...onboardingConfig },
  { name: 'newUser', component: NewUser, ...onboardingConfig },
  { name: 'restoreBackup', component: RestoreBackup, ...onboardingConfig },
]

const home: ViewType[] = [{ name: 'home', component: Buy, ...defaultConfig }]

const wallet: ViewType[] = [
  { name: 'wallet', component: Wallet, ...defaultConfig },
  { name: 'transactionHistory', component: TransactionHistory, ...defaultConfig },
  { name: 'transactionDetails', component: TransactionDetails, ...defaultConfig },
]
const buyFlow: ViewType[] = [
  { name: 'buy', component: Buy, ...defaultConfig },
  { name: 'buyPreferences', component: BuyPreferences, ...defaultConfig },
  { name: 'signMessage', component: SignMessage, ...defaultConfig },
]

const sellFlow: ViewType[] = [
  { name: 'sell', component: Sell, ...defaultConfig },
  { name: 'sellPreferences', component: SellPreferences, ...defaultConfig },
  { name: 'fundEscrow', component: FundEscrow, ...defaultConfig },
  { name: 'selectWallet', component: SelectWallet, ...defaultConfig },
  { name: 'setRefundWallet', component: SetRefundWallet, ...defaultConfig },
]

const search: ViewType[] = [
  { name: 'offerPublished', component: OfferPublished, ...invertedThemeConfig },
  { name: 'search', component: Search, ...defaultConfig },
]

const trade: ViewType[] = [
  { name: 'contract', component: Contract, ...defaultConfig },
  { name: 'contractChat', component: ContractChat, ...defaultConfig },
  { name: 'paymentMade', component: PaymentMade, ...invertedThemeConfig },
  { name: 'tradeComplete', component: TradeComplete, ...invertedThemeConfig },
]

const tradeHistory: ViewType[] = [
  { name: 'yourTrades', component: YourTrades, ...defaultConfig },
  { name: 'offer', component: OfferDetails, ...defaultConfig },
]

const contact = (hasAccount: boolean): ViewType[] =>
  hasAccount
    ? [
      { name: 'contact', component: Contact, ...defaultConfig, showFooter: hasAccount },
      { name: 'report', component: Report, ...defaultConfig, showFooter: hasAccount },
      { name: 'disputeReasonSelector', component: DisputeReasonSelector, ...defaultConfig },
      { name: 'disputeForm', component: DisputeForm, ...defaultConfig },
    ]
    : [
      { name: 'contact', component: Contact, ...defaultConfig, showFooter: false },
      { name: 'report', component: Report, ...defaultConfig, showFooter: false },
    ]

const publicProfile: ViewType[] = [{ name: 'publicProfile', component: PublicProfile, ...defaultConfig }]

const settings: ViewType[] = [
  { name: 'settings', component: Settings, ...defaultConfig },
  { name: 'aboutPeach', component: AboutPeach, ...defaultConfig },
  { name: 'myProfile', component: MyProfile, ...defaultConfig },
  { name: 'bitcoinProducts', component: BitcoinProducts, ...defaultConfig },
  { name: 'addPaymentMethod', component: AddPaymentMethod, ...defaultConfig },
  { name: 'paymentDetails', component: PaymentDetails, ...defaultConfig },
  { name: 'meetupScreen', component: MeetupScreen, ...defaultConfig },
  { name: 'currency', component: Currency, ...defaultConfig },
  { name: 'referrals', component: Referrals, ...defaultConfig },
  { name: 'backupTime', component: BackupTime, ...invertedThemeConfig, showFooter: true },
  { name: 'backups', component: Backups, ...defaultConfig },
  {
    name: 'backupCreated',
    component: BackupCreated,
    showHeader: false,
    showFooter: false,
    background: { color: 'primaryGradient' },
  },
  { name: 'payoutAddress', component: PayoutAddress, ...defaultConfig },
  { name: 'paymentMethods', component: PaymentMethods, ...defaultConfig },
  { name: 'peachFees', component: PeachFees, ...defaultConfig },
  { name: 'networkFees', component: NetworkFees, ...defaultConfig },
  { name: 'socials', component: Socials, ...defaultConfig },
]

const testViews: ViewType[] = [
  { name: 'testView', component: TestView, ...defaultConfig },
  { name: 'testViewButtons', component: TestViewButtons, ...defaultConfig },
  { name: 'testViewPopups', component: TestViewPopups, ...defaultConfig },
  { name: 'testViewMessages', component: TestViewMessages, ...defaultConfig },
  { name: 'testViewComponents', component: TestViewComponents, ...defaultConfig },
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
      ...testViews,
    ]
    : [...onboarding, ...contact(hasAccount)]
