import { Platform } from 'react-native'
import { MeetupScreen } from '../components/payment/MeetupScreen'
import { PaymentMethods } from '../components/payment/PaymentMethods'
import { PaymentMethodForm } from './addPaymentMethod/PaymentMethodForm'
import { SelectCountry } from './addPaymentMethod/SelectCountry'
import { SelectCurrency } from './addPaymentMethod/SelectCurrency'
import { SelectPaymentMethod } from './addPaymentMethod/SelectPaymentMethod'
import { Buy } from './buy/Buy'
import { BuySummary } from './buy/BuySummary'
import { SignMessage } from './buy/SignMessage'
import { CanceledOfferDetails } from './canceledOfferDetails/CanceledOfferDetails'
import { Contact } from './contact/Contact'
import { Contract } from './contract/Contract'
import { PaymentMade } from './contract/PaymentMade'
import { ContractChat } from './contractChat/ContractChat'
import { DisputeForm } from './dispute/DisputeForm'
import { DisputeReasonSelector } from './dispute/DisputeReasonSelector'
import { FundEscrow } from './fundEscrow/FundEscrow'
import { NewUser } from './newUser/NewUser'
import { BackupTime } from './overlays/BackupTime'
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
import { Backups } from './settings/Backups'
import { Currency } from './settings/Currency'
import { Language } from './settings/Language'
import { NetworkFees } from './settings/NetworkFees'
import { NodeSetup } from './settings/NodeSetup'
import { PayoutAddress } from './settings/PayoutAddress'
import { Settings } from './settings/Settings'
import { TransactionBatching } from './settings/TransactionBatching'
import { AboutPeach } from './settings/aboutPeach/AboutPeach'
import { BitcoinProducts } from './settings/aboutPeach/BitcoinProducts'
import { PeachFees } from './settings/aboutPeach/PeachFees'
import { Socials } from './settings/aboutPeach/Socials'
import { BackupCreated } from './settings/components/backups/BackupCreated'
import { MyProfile } from './settings/profile/MyProfile'

import { TestView } from './TestView/TestView'
import { TestViewPeachWallet } from './TestView/peachWallet'
import { TestViewPNs } from './TestView/pns'
import { TradeComplete } from './tradeComplete/TradeComplete'
import { UserSource } from './userSource/UserSource'
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
  animationEnabled: boolean
}

const onboarding: ViewType[] = [
  { name: 'welcome', component: Welcome, animationEnabled: false },
  { name: 'newUser', component: NewUser, animationEnabled: false },
  { name: 'userSource', component: UserSource, animationEnabled: false },
  { name: 'restoreBackup', component: RestoreBackup, animationEnabled: false },
  { name: 'restoreReputation', component: RestoreReputation, animationEnabled: false },
]

const wallet: ViewType[] = [
  { name: 'wallet', component: Wallet, animationEnabled: false },
  { name: 'sendBitcoin', component: SendBitcoin, animationEnabled: true },
  { name: 'receiveBitcoin', component: ReceiveBitcoin, animationEnabled: true },
  { name: 'addressChecker', component: AddressChecker, animationEnabled: true },
  { name: 'coinSelection', component: CoinSelection, animationEnabled: true },
  { name: 'transactionHistory', component: TransactionHistory, animationEnabled: true },
  { name: 'exportTransactionHistory', component: ExportTransactionHistory, animationEnabled: true },
  { name: 'transactionDetails', component: TransactionDetails, animationEnabled: true },
  { name: 'bumpNetworkFees', component: BumpNetworkFees, animationEnabled: true },
]
const buyFlow: ViewType[] = [
  { name: 'buy', component: Buy, animationEnabled: false },
  { name: 'buyPreferences', component: PaymentMethods, animationEnabled: true },
  { name: 'buySummary', component: BuySummary, animationEnabled: true },
  { name: 'signMessage', component: SignMessage, animationEnabled: true },
]

const sellFlow: ViewType[] = [
  { name: 'sell', component: Sell, animationEnabled: Platform.OS === 'android' },
  { name: 'premium', component: OfferPreferencePremium, animationEnabled: true },
  { name: 'sellPreferences', component: PaymentMethods, animationEnabled: true },
  { name: 'sellSummary', component: SellSummary, animationEnabled: true },
  { name: 'fundEscrow', component: FundEscrow, animationEnabled: true },
  { name: 'wrongFundingAmount', component: WrongFundingAmount, animationEnabled: true },
  { name: 'selectWallet', component: SelectWallet, animationEnabled: true },
]

const search: ViewType[] = [
  { name: 'search', component: Search, animationEnabled: true },
  { name: 'editPremium', component: EditPremium, animationEnabled: true },
]

const trade: ViewType[] = [
  { name: 'contract', component: Contract, animationEnabled: true },
  { name: 'contractChat', component: ContractChat, animationEnabled: true },
  { name: 'paymentMade', component: PaymentMade, animationEnabled: false },
  {
    name: 'tradeComplete',
    component: TradeComplete,
    animationEnabled: Platform.OS === 'android',
  },
]

const tradeHistory: ViewType[] = [
  { name: 'yourTrades', component: YourTrades, animationEnabled: false },
  { name: 'offer', component: CanceledOfferDetails, animationEnabled: true },
  { name: 'exportTradeHistory', component: ExportTradeHistory, animationEnabled: true },
]

const contact: ViewType[] = [
  { name: 'contact', component: Contact, animationEnabled: true },
  { name: 'report', component: Report, animationEnabled: true },
  { name: 'disputeReasonSelector', component: DisputeReasonSelector, animationEnabled: true },
  { name: 'disputeForm', component: DisputeForm, animationEnabled: true },
]

const publicProfile: ViewType[] = [{ name: 'publicProfile', component: PublicProfile, animationEnabled: true }]

const overlays: ViewType[] = [
  { name: 'offerPublished', component: OfferPublished, animationEnabled: false },
  { name: 'groupHugAnnouncement', component: GroupHugAnnouncement, animationEnabled: false },
  { name: 'newBadge', component: NewBadge, animationEnabled: false },
]

const settings: ViewType[] = [
  { name: 'settings', component: Settings, animationEnabled: false },
  { name: 'aboutPeach', component: AboutPeach, animationEnabled: true },
  { name: 'myProfile', component: MyProfile, animationEnabled: true },
  { name: 'bitcoinProducts', component: BitcoinProducts, animationEnabled: true },
  { name: 'selectCurrency', component: SelectCurrency, animationEnabled: true },
  { name: 'selectPaymentMethod', component: SelectPaymentMethod, animationEnabled: true },
  { name: 'selectCountry', component: SelectCountry, animationEnabled: true },
  { name: 'paymentMethodForm', component: PaymentMethodForm, animationEnabled: true },
  { name: 'meetupScreen', component: MeetupScreen, animationEnabled: true },
  { name: 'currency', component: Currency, animationEnabled: true },
  { name: 'language', component: Language, animationEnabled: true },
  { name: 'referrals', component: Referrals, animationEnabled: true },
  { name: 'backupTime', component: BackupTime, animationEnabled: false },
  { name: 'backups', component: Backups, animationEnabled: true },
  { name: 'backupCreated', component: BackupCreated, animationEnabled: false },
  { name: 'nodeSetup', component: NodeSetup, animationEnabled: true },
  { name: 'payoutAddress', component: PayoutAddress, animationEnabled: true },
  { name: 'paymentMethods', component: PaymentMethods, animationEnabled: true },
  { name: 'peachFees', component: PeachFees, animationEnabled: true },
  { name: 'networkFees', component: NetworkFees, animationEnabled: true },
  { name: 'transactionBatching', component: TransactionBatching, animationEnabled: true },
  { name: 'socials', component: Socials, animationEnabled: true },
]

const testViews: ViewType[] = [
  { name: 'testView', component: TestView, animationEnabled: true },
  { name: 'testViewPeachWallet', component: TestViewPeachWallet, animationEnabled: true },
  { name: 'testViewPNs', component: TestViewPNs, animationEnabled: true },
]

export const views = [
  ...buyFlow,
  ...sellFlow,
  ...wallet,
  ...search,
  ...trade,
  ...tradeHistory,
  ...publicProfile,
  ...contact,
  ...settings,
  ...overlays,
  ...testViews,
]

export const onboardingViews = [...onboarding, ...contact]
