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
import Offer from './yourTrades/Offer'
import YourTrades from './yourTrades/YourTrades'
import MyProfile from './settings/profile/MyProfile'
import BitcoinProducts from './settings/aboutPeach/BitcoinProducts'
import { BackgroundConfig } from '../components/background/Background'

type ViewType = {
  name: keyof RootStackParamList
  component: (props: any) => ReactElement
  showHeader: boolean
  showFooter: boolean
  background: BackgroundConfig
}

const onboarding: ViewType[] = [
  { name: 'welcome', component: Welcome, showHeader: true, showFooter: false, background: { color: 'primaryGradient' } },
  { name: 'newUser', component: NewUser, showHeader: true, showFooter: false, background: { color: 'primaryGradient' } },
  {
    name: 'restoreBackup',
    component: RestoreBackup,
    showHeader: true,
    showFooter: false,
    background: { color: 'primaryGradient' },
  },
]

const home: ViewType[] = [
  {
    name: 'home',
    component: Buy,
    showHeader: true,
    showFooter: true,
    background: { color: undefined },
  },
]

const wallet: ViewType[] = [
  { name: 'wallet', component: Wallet, showHeader: true, showFooter: true, background: { color: undefined } },
  {
    name: 'transactionHistory',
    component: TransactionHistory,
    showHeader: true,
    showFooter: true,
    background: { color: undefined },
  },
  {
    name: 'transactionDetails',
    component: TransactionDetails,
    showHeader: true,
    showFooter: true,
    background: { color: undefined },
  },
]
const buyFlow: ViewType[] = [
  { name: 'buy', component: Buy, showHeader: true, showFooter: true, background: { color: undefined } },
  {
    name: 'buyPreferences',
    component: BuyPreferences,
    showHeader: true,
    showFooter: true,
    background: { color: undefined },
  },
]

const sellFlow: ViewType[] = [
  { name: 'sell', component: Sell, showHeader: true, showFooter: true, background: { color: undefined } },
  {
    name: 'sellPreferences',
    component: SellPreferences,
    showHeader: true,
    showFooter: true,
    background: { color: undefined },
  },
  { name: 'fundEscrow', component: FundEscrow, showHeader: true, showFooter: true, background: { color: undefined } },
  {
    name: 'setReturnAddress',
    component: SetReturnAddress,
    showHeader: true,
    showFooter: true,
    background: { color: undefined },
  },
]

const search: ViewType[] = [
  {
    name: 'search',
    component: Search,
    showHeader: true,
    showFooter: true,
    background: { color: undefined },
  },
]

const trade: ViewType[] = [
  { name: 'contract', component: Contract, showHeader: true, showFooter: true, background: { color: undefined } },
  {
    name: 'contractChat',
    component: ContractChat,
    showHeader: false,
    showFooter: false,
    background: { color: undefined },
  },
  {
    name: 'tradeComplete',
    component: TradeComplete,
    showHeader: true,
    showFooter: true,
    background: { color: undefined },
  },
]

const tradeHistory: ViewType[] = [
  { name: 'yourTrades', component: YourTrades, showHeader: true, showFooter: true, background: { color: undefined } },
  { name: 'offer', component: Offer, showHeader: true, showFooter: true, background: { color: undefined } },
]

const contact = (hasAccount: boolean): ViewType[] =>
  hasAccount
    ? [
      {
        name: 'contact',
        component: Contact,
        showHeader: true,
        showFooter: hasAccount,
        background: { color: undefined },
      },
      {
        name: 'report',
        component: Report,
        showHeader: true,
        showFooter: hasAccount,
        background: { color: undefined },
      },
      {
        name: 'dispute',
        component: Dispute,
        showHeader: true,
        showFooter: hasAccount,
        background: { color: undefined },
      },
    ]
    : [
      { name: 'contact', component: Contact, showHeader: true, showFooter: false, background: { color: undefined } },
      { name: 'report', component: Report, showHeader: false, showFooter: false, background: { color: undefined } },
    ]

const profile: ViewType[] = [
  {
    name: 'profile',
    component: Profile,
    showHeader: true,
    showFooter: true,
    background: { color: undefined },
  },
]

const settings: ViewType[] = [
  { name: 'settings', component: Settings, showHeader: true, showFooter: true, background: { color: undefined } },
  { name: 'aboutPeach', component: AboutPeach, showHeader: true, showFooter: true, background: { color: undefined } },
  { name: 'myProfile', component: MyProfile, showHeader: true, showFooter: true, background: { color: undefined } },
  {
    name: 'bitcoinProducts',
    component: BitcoinProducts,
    showHeader: true,
    showFooter: true,
    background: { color: undefined },
  },
  {
    name: 'addPaymentMethod',
    component: AddPaymentMethod,
    showHeader: true,
    showFooter: false,
    background: { color: undefined },
  },
  {
    name: 'paymentDetails',
    component: PaymentDetails,
    showHeader: true,
    showFooter: false,
    background: { color: undefined },
  },
  { name: 'language', component: Language, showHeader: true, showFooter: true, background: { color: undefined } },
  { name: 'currency', component: Currency, showHeader: true, showFooter: true, background: { color: undefined } },
  { name: 'referrals', component: Referrals, showHeader: true, showFooter: true, background: { color: undefined } },
  { name: 'backups', component: Backups, showHeader: true, showFooter: true, background: { color: undefined } },
  {
    name: 'refundAddress',
    component: RefundAddress,
    showHeader: true,
    showFooter: true,
    background: { color: undefined },
  },
  {
    name: 'payoutAddress',
    component: PayoutAddress,
    showHeader: true,
    showFooter: true,
    background: { color: undefined },
  },
  {
    name: 'paymentMethods',
    component: PaymentMethods,
    showHeader: true,
    showFooter: true,
    background: { color: undefined },
  },
  { name: 'peachFees', component: PeachFees, showHeader: true, showFooter: true, background: { color: undefined } },
  { name: 'networkFees', component: NetworkFees, showHeader: true, showFooter: true, background: { color: undefined } },
  { name: 'socials', component: Socials, showHeader: true, showFooter: true, background: { color: undefined } },
]

const testViews: ViewType[] = [
  { name: 'testView', component: TestView, showHeader: true, showFooter: true, background: { color: undefined } },
  {
    name: 'testViewButtons',
    component: TestViewButtons,
    showHeader: true,
    showFooter: true,
    background: { color: undefined },
  },
  {
    name: 'testViewPopups',
    component: TestViewPopups,
    showHeader: true,
    showFooter: true,
    background: { color: undefined },
  },
  {
    name: 'testViewMessages',
    component: TestViewMessages,
    showHeader: true,
    showFooter: true,
    background: { color: undefined },
  },
  {
    name: 'testViewComponents',
    component: TestViewComponents,
    showHeader: true,
    showFooter: true,
    background: { color: undefined },
  },
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
