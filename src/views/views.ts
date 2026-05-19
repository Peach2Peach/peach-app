import { MeetupScreen } from "../components/payment/MeetupScreen";
import { PaymentMethods } from "../components/payment/PaymentMethods";
import { TestView } from "./TestView/TestView";
import { TestViewPeachWallet } from "./TestView/peachWallet";
import { TestViewPNs } from "./TestView/pns";
import { PaymentMethodForm } from "./addPaymentMethod/PaymentMethodForm";
import { SelectCountry } from "./addPaymentMethod/SelectCountry";
import { SelectCurrency } from "./addPaymentMethod/SelectCurrency";
import { SelectPaymentMethod } from "./addPaymentMethod/SelectPaymentMethod";
import { CanceledOfferDetails } from "./canceledOfferDetails/CanceledOfferDetails";
import { Contact } from "./contact/Contact";
import { Contract } from "./contract/Contract";
import { PatchPayoutAddress } from "./contract/PatchPayoutAddress";
import { SignMessage } from "./contract/SignMessage";
import { ContractChat } from "./contractChat/ContractChat";
import { ConnectToDesktop } from "./desktopConnection/ConnectToDesktop";
import { ConnectToDesktopIntro } from "./desktopConnection/ConnectToDesktopIntro";
import { PasteDesktopConnection } from "./desktopConnection/PasteDesktopConnection";
import { MobilePendingActionFundContractEscrow } from "./desktopConnection/MobilePendingActionFundContractEscrow";
import { MobilePendingActionFundContractEscrowSuccess } from "./desktopConnection/MobilePendingActionFundContractEscrowSuccess";
import { MobilePendingActionFundEscrow } from "./desktopConnection/MobilePendingActionFundEscrow";
import { MobilePendingActionFundEscrowSuccess } from "./desktopConnection/MobilePendingActionFundEscrowSuccess";
import { MobilePendingActionFundMultipleEscrow } from "./desktopConnection/MobilePendingActionFundMultipleEscrow";
import { MobilePendingActionFundMultipleEscrowSuccess } from "./desktopConnection/MobilePendingActionFundMultipleEscrowSuccess";
import { MobilePendingActionRefund } from "./desktopConnection/MobilePendingActionRefund";
import { MobilePendingActionRefundContractEscrow } from "./desktopConnection/MobilePendingActionRefundContractEscrow";
import { MobilePendingActionRefundContractEscrowSuccess } from "./desktopConnection/MobilePendingActionRefundContractEscrowSuccess";
import { MobilePendingActionRefundSuccess } from "./desktopConnection/MobilePendingActionRefundSuccess";
import { MobilePendingActionRevealAddress } from "./desktopConnection/MobilePendingActionRevealAddress";
import { MobilePendingActionRevealAddressSuccess } from "./desktopConnection/MobilePendingActionRevealAddressSuccess";
import { MobilePendingActionSignMultisig } from "./desktopConnection/MobilePendingActionSignMultisig";
import { MobilePendingActionSignMultisigSuccess } from "./desktopConnection/MobilePendingActionSignMultisigSuccess";
import { MobilePendingActions } from "./desktopConnection/MobilePendingActions";
import { DisputeForm } from "./dispute/DisputeForm";
import { DisputeReasonSelector } from "./dispute/DisputeReasonSelector";
import { FundEscrow } from "./fundEscrow/FundEscrow";
import { HomeScreen } from "./home/HomeScreen";
import { AccountCreated } from "./newUser/AccountCreated";
import { CreateAccountError } from "./newUser/CreateAccountError";
import { UserExistsForDevice } from "./newUser/UserExistsForDevice";
import { SellOfferPreferences } from "./offerPreferences/SellOfferPreferences";
import { OffersOfUser } from "./otherUser/OffersOfUser";
import { BrowseTradeRequestsToMyBuyOffer } from "./peach069/BrowseTradeRequestsToMyBuyOffer";
import { BrowseTradeRequestsToMySellOffer } from "./peach069/BrowseTradeRequestsToMySellOffer";
import { CreateBuyOffer } from "./peach069/CreateBuyOffer";
import { ExpressBuyBrowseSellOffers } from "./peach069/ExpressBuyBrowseSellOffers";
import { ExpressBuyTradeRequestToSellOffer } from "./peach069/ExpressBuyTradeRequestToSellOffer";
import { ExpressSellBrowseBuyOffers } from "./peach069/ExpressSellBrowseBuyOffers";
import { ExpressSellTradeRequestToBuyOffer } from "./peach069/ExpressSellTradeRequestToBuyOffer";
import { TradeRequestChat } from "./peach069/TradeRequestChat";
import { PublicProfile } from "./publicProfile/PublicProfile";
import { Referrals } from "./referrals/Referrals";
import { Report } from "./report/Report";
import { RestoreBackup } from "./restoreBackup/RestoreBackup";
import { RestoreReputation } from "./restoreReputation/RestoreReputation";
import { EditPremium } from "./search/EditPremium";
import { EditPremiumOfBuyOffer } from "./search/EditPremiumOfBuyOffer";
import { Backups } from "./settings/Backups";
import { ChangePin } from "./settings/ChangePin";
import { CreatePin } from "./settings/CreatePin";
import { Currency } from "./settings/Currency";
import { DeletePin } from "./settings/DeletePin";
import { Language } from "./settings/Language";
import { NodeSetup } from "./settings/NodeSetup";
import { PayoutAddress } from "./settings/PayoutAddress";
import { PinCodeSetup } from "./settings/PinCodeSetup";
import { RefundAddress } from "./settings/RefundAddress";
import { TransactionBatching } from "./settings/TransactionBatching";
import { AboutPeach } from "./settings/aboutPeach/AboutPeach";
import { BitcoinProducts } from "./settings/aboutPeach/BitcoinProducts";
import { PeachFees } from "./settings/aboutPeach/PeachFees";
import { Socials } from "./settings/aboutPeach/Socials";
import { NetworkFees } from "./settings/networkFees/NetworkFees";
import { BlockedUsers } from "./settings/profile/BlockedUsers";
import { MyProfile } from "./settings/profile/MyProfile";
import { UserBitcoinLevel } from "./userBitcoinLevel/UserBitcoinLevel";
import { UserSource } from "./userSource/UserSource";
import { AddressChecker } from "./wallet/AddressChecker";
import { BumpNetworkFees } from "./wallet/BumpNetworkFees";
import { CoinSelection } from "./wallet/CoinSelection";
import { ExportTransactionHistory } from "./wallet/ExportTransactionHistory";
import { ReceiveBitcoin } from "./wallet/ReceiveBitcoin";
import { SendBitcoin } from "./wallet/SendBitcoin";
import { TransactionDetails } from "./wallet/TransactionDetails";
import { TransactionHistory } from "./wallet/TransactionHistory";
import { Welcome } from "./welcome/Welcome";
import { WrongFundingAmount } from "./wrongFundingAmount/WrongFundingAmount";
import { ExportTradeHistory } from "./yourTrades/ExportTradeHistory";

import type { ReactElement } from "react";

type ViewType = {
  name: keyof RootStackParamList;
  component: () => ReactElement;
  animation?: "none";
};

const onboarding: ViewType[] = [
  { name: "welcome", component: Welcome, animation: "none" },
  {
    name: "userExistsForDevice",
    component: UserExistsForDevice,
    animation: "none",
  },
  {
    name: "accountCreated",
    component: AccountCreated,
    animation: "none",
  },
  {
    name: "createAccountError",
    component: CreateAccountError,
    animation: "none",
  },
  { name: "userSource", component: UserSource, animation: "none" },
  {
    name: "userBitcoinLevel",
    component: UserBitcoinLevel,
    animation: "none",
  },
  { name: "restoreBackup", component: RestoreBackup, animation: "none" },
  {
    name: "restoreReputation",
    component: RestoreReputation,
    animation: "none",
  },
];

const home: ViewType[] = [{ name: "homeScreen", component: HomeScreen }];

const wallet: ViewType[] = [
  { name: "sendBitcoin", component: SendBitcoin },
  { name: "receiveBitcoin", component: ReceiveBitcoin },
  { name: "addressChecker", component: AddressChecker },
  { name: "coinSelection", component: CoinSelection },
  { name: "transactionHistory", component: TransactionHistory },
  { name: "exportTransactionHistory", component: ExportTransactionHistory },
  { name: "transactionDetails", component: TransactionDetails },
  { name: "bumpNetworkFees", component: BumpNetworkFees },
];

const sellFlow: ViewType[] = [
  { name: "sellOfferPreferences", component: SellOfferPreferences },
  { name: "fundEscrow", component: FundEscrow },
  { name: "wrongFundingAmount", component: WrongFundingAmount },
  { name: "editPremium", component: EditPremium },
];

const trade: ViewType[] = [
  { name: "contract", component: Contract },
  { name: "contractChat", component: ContractChat },
  { name: "patchPayoutAddress", component: PatchPayoutAddress },
  { name: "signMessage", component: SignMessage },
];

const tradeHistory: ViewType[] = [
  { name: "offer", component: CanceledOfferDetails },
  { name: "exportTradeHistory", component: ExportTradeHistory },
];

const contact: ViewType[] = [
  { name: "contact", component: Contact },
  { name: "report", component: Report },
  { name: "disputeReasonSelector", component: DisputeReasonSelector },
  { name: "disputeForm", component: DisputeForm },
];

const publicProfile: ViewType[] = [
  { name: "publicProfile", component: PublicProfile },
];

const settings: ViewType[] = [
  { name: "aboutPeach", component: AboutPeach },
  { name: "myProfile", component: MyProfile },
  { name: "bitcoinProducts", component: BitcoinProducts },
  { name: "selectCurrency", component: SelectCurrency },
  { name: "selectPaymentMethod", component: SelectPaymentMethod },
  { name: "selectCountry", component: SelectCountry },
  { name: "paymentMethodForm", component: PaymentMethodForm },
  { name: "meetupScreen", component: MeetupScreen },
  { name: "currency", component: Currency },
  { name: "language", component: Language },
  { name: "referrals", component: Referrals },
  { name: "backups", component: Backups },
  { name: "nodeSetup", component: NodeSetup },
  { name: "pinCodeSetup", component: PinCodeSetup },
  { name: "deletePin", component: DeletePin },
  { name: "createPin", component: CreatePin },
  { name: "changePin", component: ChangePin },
  { name: "refundAddress", component: RefundAddress },
  { name: "payoutAddress", component: PayoutAddress },
  { name: "paymentMethods", component: PaymentMethods },
  { name: "peachFees", component: PeachFees },
  { name: "networkFees", component: NetworkFees },
  { name: "transactionBatching", component: TransactionBatching },
  { name: "socials", component: Socials },
];

const testViews: ViewType[] = [
  { name: "testView", component: TestView },
  { name: "testViewPeachWallet", component: TestViewPeachWallet },
  { name: "testViewPNs", component: TestViewPNs },
];

// Peach 0.69

const expressBuyFlow: ViewType[] = [
  { name: "expressBuyBrowseSellOffers", component: ExpressBuyBrowseSellOffers },
  {
    name: "expressBuyTradeRequest",
    component: ExpressBuyTradeRequestToSellOffer,
  },
];
const expressSellFlow: ViewType[] = [
  { name: "expressSellBrowseBuyOffers", component: ExpressSellBrowseBuyOffers },
  {
    name: "expressSellTradeRequest",
    component: ExpressSellTradeRequestToBuyOffer,
  },
];

const buyOfferOwnerFlow: ViewType[] = [
  { name: "createBuyOffer", component: CreateBuyOffer },
  {
    name: "browseTradeRequestsToMyBuyOffer",
    component: BrowseTradeRequestsToMyBuyOffer,
  },
  { name: "editPremiumOfBuyOffer", component: EditPremiumOfBuyOffer },
];

const sellOfferOwnerFlow: ViewType[] = [
  {
    name: "browseTradeRequestsToMySellOffer",
    component: BrowseTradeRequestsToMySellOffer,
  },
];

const tradeRequestChat: ViewType[] = [
  {
    name: "tradeRequestChat",
    component: TradeRequestChat,
  },
];

const otherUserViews: ViewType[] = [
  {
    name: "offersOfUser",
    component: OffersOfUser,
  },
];

const desktopConnection: ViewType[] = [
  {
    name: "connectToDesktop",
    component: ConnectToDesktopIntro,
  },
  {
    name: "connectToDesktopPage",
    component: ConnectToDesktop,
  },
  {
    name: "pasteDesktopConnection",
    component: PasteDesktopConnection,
  },
  {
    name: "mobilePendingActions",
    component: MobilePendingActions,
  },
  {
    name: "mobilePendingActionRevealAddress",
    component: MobilePendingActionRevealAddress,
  },
  {
    name: "mobilePendingActionRevealAddressSuccess",
    component: MobilePendingActionRevealAddressSuccess,
  },
  {
    name: "mobilePendingActionSignMultisig",
    component: MobilePendingActionSignMultisig,
  },
  {
    name: "mobilePendingActionSignMultisigSuccess",
    component: MobilePendingActionSignMultisigSuccess,
  },
  {
    name: "mobilePendingActionRefund",
    component: MobilePendingActionRefund,
  },
  {
    name: "mobilePendingActionRefundSuccess",
    component: MobilePendingActionRefundSuccess,
  },
  {
    name: "mobilePendingActionFundEscrow",
    component: MobilePendingActionFundEscrow,
  },
  {
    name: "mobilePendingActionFundEscrowSuccess",
    component: MobilePendingActionFundEscrowSuccess,
  },
  {
    name: "mobilePendingActionFundMultipleEscrow",
    component: MobilePendingActionFundMultipleEscrow,
  },
  {
    name: "mobilePendingActionFundMultipleEscrowSuccess",
    component: MobilePendingActionFundMultipleEscrowSuccess,
  },
  {
    name: "mobilePendingActionFundContractEscrow",
    component: MobilePendingActionFundContractEscrow,
  },
  {
    name: "mobilePendingActionFundContractEscrowSuccess",
    component: MobilePendingActionFundContractEscrowSuccess,
  },
  {
    name: "mobilePendingActionRefundContractEscrow",
    component: MobilePendingActionRefundContractEscrow,
  },
  {
    name: "mobilePendingActionRefundContractEscrowSuccess",
    component: MobilePendingActionRefundContractEscrowSuccess,
  },
];

const blockedUsers: ViewType[] = [
  {
    name: "blockedUsers",
    component: BlockedUsers,
  },
];

export const views = [
  ...home,
  ...sellFlow,
  ...wallet,
  ...trade,
  ...tradeHistory,
  ...publicProfile,
  ...contact,
  ...settings,
  ...testViews,
  ...expressBuyFlow,
  ...expressSellFlow,
  ...buyOfferOwnerFlow,
  ...sellOfferOwnerFlow,
  ...tradeRequestChat,
  ...otherUserViews,
  ...desktopConnection,
  ...blockedUsers,
];

export const onboardingViews = [...onboarding, ...contact];
