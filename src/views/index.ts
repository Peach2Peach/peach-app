import { ReactElement } from 'react'

import AboutPeach from './settings/aboutPeach/AboutPeach'
import AddPaymentMethod from './addPaymentMethod/AddPaymentMethod'
import PaymentDetails from './addPaymentMethod/PaymentDetails'
import Buy from './buy/Buy'
import BuyPreferences from './buy/BuyPreferences'
import Contact from './contact/Contact'
import Contract from './contract/Contract'
import ContractChat from './contractChat/ContractChat'
import Dispute from './dispute/Dispute'
import NewUser from './newUser/NewUser'
import Profile from './profile/Profile'
import Referrals from './referrals/Referrals'
import Report from './report/Report'
import RestoreBackup from './restoreBackup/RestoreBackup'
import Search from './search/Search'
import FundEscrow from './sell/FundEscrow'
import Sell from './sell/Sell'
import SellPreferences from './sell/SellPreferences'
import SetReturnAddress from './sell/SetReturnAddress'
import Backups from './settings/Backups'
import Currency from './settings/Currency'
import PeachFees from './settings/aboutPeach/PeachFees'
import NetworkFees from './settings/NetworkFees'
import Language from './settings/Language'
import PaymentMethods from './settings/PaymentMethods'
import PayoutAddress from './settings/PayoutAddress'
import RefundAddress from './settings/RefundAddress'
import Settings from './settings/Settings'
import Socials from './settings/aboutPeach/Socials'
import TestViewButtons from './TestView/buttons'
import TestViewMessages from './TestView/messages'
import TestViewComponents from './TestView/components'
import TestViewPopups from './TestView/popups'
import TestView from './TestView/TestView'
import TradeComplete from './tradeComplete/TradeComplete'
import TransactionDetails from './wallet/TransactionDetails'
import TransactionHistory from './wallet/TransactionHistory'
import Wallet from './wallet/Wallet'
import Welcome from './welcome/Welcome'
import OfferDetails from './offerDetails/OfferDetails'
import YourTrades from './yourTrades/YourTrades'
import MyProfile from './settings/profile/MyProfile'
import BitcoinProducts from './settings/aboutPeach/BitcoinProducts'

type ViewType = {
  name: keyof RootStackParamList
  component: (props: any) => ReactElement
  showHeader: boolean
  showFooter: boolean
}

const onboarding: ViewType[] = [
  { name: 'welcome', component: Welcome, showHeader: true, showFooter: false },
  { name: 'home', component: Welcome, showHeader: true, showFooter: false },
  { name: 'newUser', component: NewUser, showHeader: true, showFooter: false },
  { name: 'restoreBackup', component: RestoreBackup, showHeader: true, showFooter: false },
]

const home: ViewType[] = [{ name: 'home', component: Buy, showHeader: true, showFooter: true }]

const wallet: ViewType[] = [
  { name: 'wallet', component: Wallet, showHeader: true, showFooter: true },
  { name: 'transactionHistory', component: TransactionHistory, showHeader: true, showFooter: true },
  { name: 'transactionDetails', component: TransactionDetails, showHeader: true, showFooter: true },
]
const buyFlow: ViewType[] = [
  { name: 'buy', component: Buy, showHeader: true, showFooter: true },
  { name: 'buyPreferences', component: BuyPreferences, showHeader: true, showFooter: true },
]

const sellFlow: ViewType[] = [
  { name: 'sell', component: Sell, showHeader: true, showFooter: true },
  { name: 'sellPreferences', component: SellPreferences, showHeader: true, showFooter: true },
  { name: 'fundEscrow', component: FundEscrow, showHeader: true, showFooter: true },
  { name: 'setReturnAddress', component: SetReturnAddress, showHeader: true, showFooter: true },
]

const search: ViewType[] = [{ name: 'search', component: Search, showHeader: true, showFooter: true }]

const trade: ViewType[] = [
  { name: 'contract', component: Contract, showHeader: true, showFooter: true },
  { name: 'contractChat', component: ContractChat, showHeader: false, showFooter: false },
  { name: 'tradeComplete', component: TradeComplete, showHeader: true, showFooter: true },
]

const tradeHistory: ViewType[] = [
  { name: 'yourTrades', component: YourTrades, showHeader: true, showFooter: true },
  { name: 'offer', component: OfferDetails, showHeader: true, showFooter: true },
]

const contact = (hasAccount: boolean): ViewType[] =>
  hasAccount
    ? [
      { name: 'contact', component: Contact, showHeader: true, showFooter: true },
      { name: 'report', component: Report, showHeader: true, showFooter: true },
      { name: 'dispute', component: Dispute, showHeader: true, showFooter: true },
    ]
    : [
      { name: 'contact', component: Contact, showHeader: true, showFooter: true },
      { name: 'reportFullScreen', component: Report, showHeader: false, showFooter: false },
    ]

const profile: ViewType[] = [{ name: 'profile', component: Profile, showHeader: true, showFooter: true }]

const settings: ViewType[] = [
  { name: 'settings', component: Settings, showHeader: true, showFooter: true },
  { name: 'aboutPeach', component: AboutPeach, showHeader: true, showFooter: true },
  { name: 'myProfile', component: MyProfile, showHeader: true, showFooter: true },
  { name: 'bitcoinProducts', component: BitcoinProducts, showHeader: true, showFooter: true },
  { name: 'addPaymentMethod', component: AddPaymentMethod, showHeader: true, showFooter: false },
  { name: 'paymentDetails', component: PaymentDetails, showHeader: true, showFooter: false },
  { name: 'language', component: Language, showHeader: true, showFooter: true },
  { name: 'currency', component: Currency, showHeader: true, showFooter: true },
  { name: 'referrals', component: Referrals, showHeader: true, showFooter: true },
  { name: 'backups', component: Backups, showHeader: true, showFooter: true },
  { name: 'refundAddress', component: RefundAddress, showHeader: true, showFooter: true },
  { name: 'payoutAddress', component: PayoutAddress, showHeader: true, showFooter: true },
  { name: 'paymentMethods', component: PaymentMethods, showHeader: true, showFooter: true },
  { name: 'peachFees', component: PeachFees, showHeader: true, showFooter: true },
  { name: 'networkFees', component: NetworkFees, showHeader: true, showFooter: true },
  { name: 'socials', component: Socials, showHeader: true, showFooter: true },
]

const testViews: ViewType[] = [
  { name: 'testView', component: TestView, showHeader: true, showFooter: true },
  { name: 'testViewButtons', component: TestViewButtons, showHeader: true, showFooter: true },
  { name: 'testViewPopups', component: TestViewPopups, showHeader: true, showFooter: true },
  { name: 'testViewMessages', component: TestViewMessages, showHeader: true, showFooter: true },
  { name: 'testViewComponents', component: TestViewComponents, showHeader: true, showFooter: true },
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
      ...profile,
      ...contact(hasAccount),
      ...settings,
      ...testViews,
    ]
    : [...onboarding, ...contact(hasAccount)]
