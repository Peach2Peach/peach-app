import { Platform } from 'react-native'
import { MeetupScreen } from '../components/payment/MeetupScreen'
import { PaymentMethods } from '../components/payment/PaymentMethods'
import { TestView } from './TestView/TestView'
import { TestViewPeachWallet } from './TestView/peachWallet'
import { TestViewPNs } from './TestView/pns'
import { PaymentMethodForm } from './addPaymentMethod/PaymentMethodForm'
import { SelectCountry } from './addPaymentMethod/SelectCountry'
import { SelectCurrency } from './addPaymentMethod/SelectCurrency'
import { SelectPaymentMethod } from './addPaymentMethod/SelectPaymentMethod'
import { SignMessage } from './buy/SignMessage'
import { CanceledOfferDetails } from './canceledOfferDetails/CanceledOfferDetails'
import { Contact } from './contact/Contact'
import { Contract } from './contract/Contract'
import { PaymentMade } from './contract/PaymentMade'
import { ContractChat } from './contractChat/ContractChat'
import { DisputeForm } from './dispute/DisputeForm'
import { DisputeReasonSelector } from './dispute/DisputeReasonSelector'
import { Explore } from './explore/Explore'
import { MatchDetails } from './explore/MatchDetails'
import { FundEscrow } from './fundEscrow/FundEscrow'
import { HomeScreen } from './home/HomeScreen'
import { NewUser } from './newUser/NewUser'
import { BuyOfferPreferences } from './offerPreferences/BuyOfferPreferences'
import { EditBuyPreferences } from './offerPreferences/EditBuyPreferences'
import { SellOfferPreferences } from './offerPreferences/SellOfferPreferences'
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
import { Backups } from './settings/Backups'
import { Currency } from './settings/Currency'
import { CustomAddress } from './settings/CustomAddress'
import { Language } from './settings/Language'
import { NetworkFees } from './settings/NetworkFees'
import { NodeSetup } from './settings/NodeSetup'
import { TransactionBatching } from './settings/TransactionBatching'
import { AboutPeach } from './settings/aboutPeach/AboutPeach'
import { BitcoinProducts } from './settings/aboutPeach/BitcoinProducts'
import { PeachFees } from './settings/aboutPeach/PeachFees'
import { Socials } from './settings/aboutPeach/Socials'
import { BackupCreated } from './settings/components/backups/BackupCreated'
import { MyProfile } from './settings/profile/MyProfile'
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
import { Welcome } from './welcome/Welcome'
import { WrongFundingAmount } from './wrongFundingAmount/WrongFundingAmount'
import { ExportTradeHistory } from './yourTrades/ExportTradeHistory'

type ViewType = {
  name: keyof RootStackParamList
  component: () => JSX.Element
  animationEnabled?: boolean
}

const onboarding: ViewType[] = [
  { name: 'welcome', component: Welcome, animationEnabled: false },
  { name: 'newUser', component: NewUser, animationEnabled: false },
  { name: 'userSource', component: UserSource, animationEnabled: false },
  { name: 'restoreBackup', component: RestoreBackup, animationEnabled: false },
  { name: 'restoreReputation', component: RestoreReputation, animationEnabled: false },
]

const home: ViewType[] = [{ name: 'homeScreen', component: HomeScreen }]

const wallet: ViewType[] = [
  { name: 'sendBitcoin', component: SendBitcoin },
  { name: 'receiveBitcoin', component: ReceiveBitcoin },
  { name: 'addressChecker', component: AddressChecker },
  { name: 'coinSelection', component: CoinSelection },
  { name: 'transactionHistory', component: TransactionHistory },
  { name: 'exportTransactionHistory', component: ExportTransactionHistory },
  { name: 'transactionDetails', component: TransactionDetails },
  { name: 'bumpNetworkFees', component: BumpNetworkFees },
]
const buyFlow: ViewType[] = [
  { name: 'buyOfferPreferences', component: BuyOfferPreferences },
  { name: 'signMessage', component: SignMessage },
  { name: 'explore', component: Explore },
  { name: 'editBuyPreferences', component: EditBuyPreferences },
  { name: 'matchDetails', component: MatchDetails },
]

const sellFlow: ViewType[] = [
  { name: 'sellOfferPreferences', component: SellOfferPreferences },
  { name: 'fundEscrow', component: FundEscrow },
  { name: 'wrongFundingAmount', component: WrongFundingAmount },
  { name: 'search', component: Search },
  { name: 'editPremium', component: EditPremium },
]

const trade: ViewType[] = [
  { name: 'contract', component: Contract },
  { name: 'contractChat', component: ContractChat },
  { name: 'paymentMade', component: PaymentMade, animationEnabled: false },
  {
    name: 'tradeComplete',
    component: TradeComplete,
    animationEnabled: Platform.OS === 'android',
  },
]

const tradeHistory: ViewType[] = [
  { name: 'offer', component: CanceledOfferDetails },
  { name: 'exportTradeHistory', component: ExportTradeHistory },
]

const contact: ViewType[] = [
  { name: 'contact', component: Contact },
  { name: 'report', component: Report },
  { name: 'disputeReasonSelector', component: DisputeReasonSelector },
  { name: 'disputeForm', component: DisputeForm },
]

const publicProfile: ViewType[] = [{ name: 'publicProfile', component: PublicProfile }]

const overlays: ViewType[] = [
  { name: 'offerPublished', component: OfferPublished, animationEnabled: false },
  { name: 'groupHugAnnouncement', component: GroupHugAnnouncement, animationEnabled: false },
  { name: 'newBadge', component: NewBadge, animationEnabled: false },
]

const settings: ViewType[] = [
  { name: 'aboutPeach', component: AboutPeach },
  { name: 'myProfile', component: MyProfile },
  { name: 'bitcoinProducts', component: BitcoinProducts },
  { name: 'selectCurrency', component: SelectCurrency },
  { name: 'selectPaymentMethod', component: SelectPaymentMethod },
  { name: 'selectCountry', component: SelectCountry },
  { name: 'paymentMethodForm', component: PaymentMethodForm },
  { name: 'meetupScreen', component: MeetupScreen },
  { name: 'currency', component: Currency },
  { name: 'language', component: Language },
  { name: 'referrals', component: Referrals },
  { name: 'backupTime', component: BackupTime, animationEnabled: false },
  { name: 'backups', component: Backups },
  { name: 'backupCreated', component: BackupCreated, animationEnabled: false },
  { name: 'nodeSetup', component: NodeSetup },
  { name: 'payoutAddress', component: CustomAddress },
  { name: 'paymentMethods', component: PaymentMethods },
  { name: 'peachFees', component: PeachFees },
  { name: 'networkFees', component: NetworkFees },
  { name: 'transactionBatching', component: TransactionBatching },
  { name: 'socials', component: Socials },
]

const testViews: ViewType[] = [
  { name: 'testView', component: TestView },
  { name: 'testViewPeachWallet', component: TestViewPeachWallet },
  { name: 'testViewPNs', component: TestViewPNs },
]

export const views = [
  ...home,
  ...buyFlow,
  ...sellFlow,
  ...wallet,
  ...trade,
  ...tradeHistory,
  ...publicProfile,
  ...contact,
  ...settings,
  ...overlays,
  ...testViews,
]

export const onboardingViews = [...onboarding, ...contact]
