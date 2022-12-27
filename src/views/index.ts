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
import TestViewPopups from './TestView/popups'
import TestView from './TestView/TestView'
import TradeComplete from './tradeComplete/TradeComplete'
import Welcome from './welcome/Welcome'
import Offer from './yourTrades/Offer'
import YourTrades from './yourTrades/YourTrades'
import BitcoinProducts from './settings/aboutPeach/BitcoinProducts'

type ViewType = {
  name: keyof RootStackParamList
  component: (props: any) => ReactElement
  showHeader: boolean
  showFooter: boolean
}

export const getViews = (hasAccount: boolean): ViewType[] =>
  hasAccount
    ? [
      { name: 'home', component: Buy, showHeader: true, showFooter: true },
      { name: 'buy', component: Buy, showHeader: true, showFooter: true },
      { name: 'buyPreferences', component: BuyPreferences, showHeader: true, showFooter: false },
      { name: 'sell', component: Sell, showHeader: true, showFooter: true },
      { name: 'sellPreferences', component: SellPreferences, showHeader: true, showFooter: false },
      { name: 'fundEscrow', component: FundEscrow, showHeader: true, showFooter: true },
      { name: 'setReturnAddress', component: SetReturnAddress, showHeader: true, showFooter: true },
      { name: 'addPaymentMethod', component: AddPaymentMethod, showHeader: true, showFooter: false },
      { name: 'paymentDetails', component: PaymentDetails, showHeader: true, showFooter: false },
      { name: 'search', component: Search, showHeader: true, showFooter: true },
      { name: 'contract', component: Contract, showHeader: true, showFooter: true },
      { name: 'contractChat', component: ContractChat, showHeader: false, showFooter: false },
      { name: 'tradeComplete', component: TradeComplete, showHeader: true, showFooter: true },
      { name: 'yourTrades', component: YourTrades, showHeader: true, showFooter: true },
      { name: 'offer', component: Offer, showHeader: true, showFooter: true },
      { name: 'profile', component: Profile, showHeader: true, showFooter: true },
      { name: 'settings', component: Settings, showHeader: true, showFooter: true },
      { name: 'aboutPeach', component: AboutPeach, showHeader: true, showFooter: true },
      { name: 'bitcoinProducts', component: BitcoinProducts, showHeader: true, showFooter: true },
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
      { name: 'contact', component: Contact, showHeader: true, showFooter: true },
      { name: 'report', component: Report, showHeader: true, showFooter: true },
      { name: 'dispute', component: Dispute, showHeader: true, showFooter: true },

      { name: 'testView', component: TestView, showHeader: true, showFooter: true },
      { name: 'testViewButtons', component: TestViewButtons, showHeader: true, showFooter: true },
      { name: 'testViewPopups', component: TestViewPopups, showHeader: true, showFooter: true },
      { name: 'testViewMessages', component: TestViewMessages, showHeader: true, showFooter: true },
    ]
    : [
      { name: 'welcome', component: Welcome, showHeader: true, showFooter: false },
      { name: 'newUser', component: NewUser, showHeader: true, showFooter: false },
      { name: 'restoreBackup', component: RestoreBackup, showHeader: true, showFooter: false },
      { name: 'contact', component: Contact, showHeader: true, showFooter: true },
      { name: 'reportFullScreen', component: Report, showHeader: false, showFooter: false },
    ]
