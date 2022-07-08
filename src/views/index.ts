import { ReactElement } from 'react'


// import Home from './home/Home'
import Buy from './buy/Buy'
import Sell from './sell/Sell'
import Offers from './offers/Offers'
import SplashScreen from './splashScreen/SplashScreen'
import Welcome from './welcome/Welcome'
import NewUser from './newUser/NewUser'
import Login from './login/Login'
import RestoreBackup from './restoreBackup/RestoreBackup'
import Search from './search/Search'
import Contract from './contract/Contract'
import ContractChat from './contractChat/ContractChat'
import TradeComplete from './tradeComplete/TradeComplete'
import Offer from './offers/Offer'
import Settings from './settings/Settings'
import Contact from './contact/Contact'
import Report from './report/Report'
import Language from './settings/Language'
import Currency from './settings/Currency'
import Backups from './settings/Backups'
import SeedWords from './settings/SeedWords'
import Escrow from './settings/Escrow'
import PaymentMethods from './settings/PaymentMethods'
import Fees from './settings/Fees'
import Socials from './settings/Socials'
import Profile from './profile/Profile'
import Dispute from './dispute/Dispute'


type ViewType = {
  name: keyof RootStackParamList,
  component: (props: any) => ReactElement,
  showHeader: boolean,
  showFooter: boolean,
}

export const views: ViewType[] = [
  { name: 'splashScreen', component: SplashScreen, showHeader: false, showFooter: false },
  { name: 'welcome', component: Welcome, showHeader: false, showFooter: false },
  { name: 'newUser', component: NewUser, showHeader: false, showFooter: false },
  { name: 'login', component: Login, showHeader: false, showFooter: false },
  { name: 'restoreBackup', component: RestoreBackup, showHeader: false, showFooter: false },
  // { name: 'home', component: Home, showHeader: false, showFooter: true },
  { name: 'home', component: Buy, showHeader: true, showFooter: true },
  { name: 'buy', component: Buy, showHeader: true, showFooter: true },
  { name: 'sell', component: Sell, showHeader: true, showFooter: true },
  { name: 'search', component: Search, showHeader: true, showFooter: true },
  { name: 'contract', component: Contract, showHeader: true, showFooter: true },
  { name: 'contractChat', component: ContractChat, showHeader: true, showFooter: true },
  { name: 'tradeComplete', component: TradeComplete, showHeader: true, showFooter: true },
  { name: 'offers', component: Offers, showHeader: true, showFooter: true },
  { name: 'offer', component: Offer, showHeader: true, showFooter: true },
  { name: 'profile', component: Profile, showHeader: true, showFooter: true },
  { name: 'settings', component: Settings, showHeader: true, showFooter: true },
  { name: 'language', component: Language, showHeader: true, showFooter: true },
  { name: 'currency', component: Currency, showHeader: true, showFooter: true },
  { name: 'backups', component: Backups, showHeader: true, showFooter: true },
  { name: 'seedWords', component: SeedWords, showHeader: true, showFooter: true },
  { name: 'escrow', component: Escrow, showHeader: true, showFooter: true },
  { name: 'paymentMethods', component: PaymentMethods, showHeader: true, showFooter: true },
  { name: 'fees', component: Fees, showHeader: true, showFooter: true },
  { name: 'socials', component: Socials, showHeader: true, showFooter: true },
  { name: 'contact', component: Contact, showHeader: true, showFooter: true },
  { name: 'report', component: Report, showHeader: true, showFooter: true },
  { name: 'dispute', component: Dispute, showHeader: true, showFooter: true },
]

export default views