import { TouchableOpacity, View } from "react-native";
import { shallow } from "zustand/shallow";
import { APPLINKS } from "../../../APPLINKS";
import { Icon } from "../../../components/Icon";
import { Bubble } from "../../../components/bubble/Bubble";
import { useCashPaymentMethodName } from "../../../components/matches/useCashPaymentMethodName";
import { useWalletLabel } from "../../../components/offer/useWalletLabel";
import { PeachText } from "../../../components/text/PeachText";
import { useOfferDetail } from "../../../hooks/query/useOfferDetail";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore";
import tw from "../../../styles/tailwind";
import { contractIdToHex } from "../../../utils/contract/contractIdToHex";
import { getBitcoinPriceFromContract } from "../../../utils/contract/getBitcoinPriceFromContract";
import { getBuyOfferIdFromContract } from "../../../utils/contract/getBuyOfferIdFromContract";
import { toShortDateFormat } from "../../../utils/date/toShortDateFormat";
import i18n from "../../../utils/i18n";
import { keys } from "../../../utils/object/keys";
import { isBuyOffer } from "../../../utils/offer/isBuyOffer";
import { isCashTrade } from "../../../utils/paymentMethod/isCashTrade";
import { groupChars } from "../../../utils/string/groupChars";
import { priceFormat } from "../../../utils/string/priceFormat";
import { openURL } from "../../../utils/web/openURL";
import { UserId } from "../../settings/profile/profileOverview/UserId";
import { SummaryItem } from "../components/SummaryItem";
import { TradeBreakdownBubble } from "../components/TradeBreakdownBubble";
import { useContractContext } from "../context";

const SATS_GROUP_SIZE = 3;

export const tradeInformationGetters: Record<
  | "bitcoinAmount"
  | "bitcoinPrice"
  | "location"
  | "meetup"
  | "method"
  | "paidToMethod"
  | "paidToWallet"
  | "paidWithMethod"
  | "paymentConfirmed"
  | "price"
  | "ratingBuyer"
  | "ratingSeller"
  | "soldFor"
  | "tradeBreakdown"
  | "tradeId"
  | "via"
  | "youPaid"
  | "youWillGet",
  (contract: Contract) => string | number | JSX.Element | undefined
> & {
  buyer: (contract: Contract) => JSX.Element;
  seller: (contract: Contract) => JSX.Element;
  youShouldPay: (contract: Contract) => JSX.Element;
} = {
  price: getPrice,
  soldFor: getPrice,
  youShouldPay: (contract: Contract) => <YouShouldPay contract={contract} />,
  youPaid: getPrice,
  youWillGet: getPrice,
  buyer: (contract: Contract) => <UserId id={contract.buyer.id} showInfo />,
  paidWithMethod: getPaymentMethod,
  paidToMethod: getPaymentMethodBubble,
  paidToWallet: (contract: Contract) => <PaidToWallet contract={contract} />,
  paymentConfirmed: (contract: Contract) =>
    toShortDateFormat(contract.paymentConfirmed || new Date(), true),
  bitcoinAmount: (contract: Contract) => contract.amount,
  bitcoinPrice: (contract: Contract) => {
    const bitcoinPrice = getBitcoinPriceFromContract(contract);
    if (contract.currency === "SAT")
      return `${groupChars(String(bitcoinPrice), SATS_GROUP_SIZE)} ${contract.currency}`;
    return `${priceFormat(bitcoinPrice)} ${contract.currency}`;
  },
  ratingBuyer: (contract: Contract) => getRatingBubble(contract, "Buyer"),
  ratingSeller: (contract: Contract) => getRatingBubble(contract, "Seller"),
  seller: (contract: Contract) => <UserId id={contract.seller.id} showInfo />,
  tradeBreakdown: (contract: Contract) => (
    <TradeBreakdownBubble contract={contract} />
  ),
  tradeId: (contract: Contract) => contractIdToHex(contract.id),
  via: getPaymentMethodBubble,
  method: getPaymentMethod,
  meetup: getPaymentMethod,
  location: (_contract: Contract) => i18n("contract.summary.location.text"),
};

const allPossibleFields = [
  "accountNumber",
  "accountType",
  "alias",
  "aliasType",
  "bankAccountNumber",
  "bankBranch",
  "bankCode",
  "bankName",
  "beneficiary",
  "beneficiaryAddress",
  "bic",
  "bitcoinAmount",
  "bitcoinPrice",
  "branchCode",
  "branchName",
  "bsbNumber",
  "buyer",
  "cedulaID",
  "DNI",
  "email",
  "iban",
  "location",
  "lnurlAddress",
  "meetup",
  "method",
  "mobileMoneyIdentifier",
  "name",
  "nameTag",
  "paidToMethod",
  "paidToWallet",
  "paidWithMethod",
  "paymentConfirmed",
  "phone",
  "pixAlias",
  "postePayNumber",
  "price",
  "ratingBuyer",
  "ratingSeller",
  "receiveAddress",
  "reference",
  "residentialAddress",
  "routingDetails",
  "RUT",
  "seller",
  "soldFor",
  "steamFriendCode",
  "tradeBreakdown",
  "tradeId",
  "ukBankAccount",
  "ukSortCode",
  "userId",
  "userName",
  "via",
  "wallet",
  "youPaid",
  "youShouldPay",
  "youWillGet",
] as const;
export type TradeInfoField = (typeof allPossibleFields)[number];
export const isTradeInformationGetter = (
  fieldName: keyof typeof tradeInformationGetters | TradeInfoField,
): fieldName is keyof typeof tradeInformationGetters =>
  fieldName in tradeInformationGetters;

function getPrice(contract: Contract) {
  return `${
    contract.currency === "SAT"
      ? groupChars(String(contract.price), SATS_GROUP_SIZE)
      : priceFormat(contract.price)
  } ${contract.currency}`;
}

function getPaymentMethodBubble(contract: Contract) {
  return <PaymentMethodBubble contract={contract} />;
}

function PaymentMethodBubble({ contract }: { contract: Contract }) {
  const { paymentMethod } = contract;
  const url = paymentMethod in APPLINKS ? APPLINKS[paymentMethod] : undefined;
  const hasLink = !!url;
  const openLink = () => (url ? openURL(url) : null);
  const { paymentData } = useContractContext();
  const paymentMethods = usePaymentDataStore(
    (state) => Object.values(state.paymentData),
    shallow,
  );
  const paymentMethodLabel = paymentData
    ? paymentMethods.find(
        (data) =>
          data.type === paymentMethod &&
          keys(paymentData).every(
            (key) => key in data && paymentData[key] === data[key],
          ),
      )?.label
    : undefined;

  return (
    <View style={tw`items-end gap-1`}>
      {paymentMethodLabel || !isCashTrade(paymentMethod) ? (
        <Bubble color={"gray"}>
          {paymentMethodLabel ?? i18n(`paymentMethod.${paymentMethod}`)}
        </Bubble>
      ) : (
        <EventNameBubble paymentMethod={paymentMethod} />
      )}
      {hasLink && (
        <TouchableOpacity
          onPress={openLink}
          style={tw`flex-row items-center justify-end gap-1`}
        >
          <PeachText style={tw`underline body-s text-black-65`}>
            {i18n("contract.summary.openApp")}
          </PeachText>
          <Icon id="externalLink" size={16} color={tw.color("primary-main")} />
        </TouchableOpacity>
      )}
    </View>
  );
}

function EventNameBubble({
  paymentMethod,
}: {
  paymentMethod: `cash.${string}`;
}) {
  const eventName = useCashPaymentMethodName(paymentMethod);
  return <Bubble color={"primary-mild"}>{eventName}</Bubble>;
}

function getRatingBubble(contract: Contract, userType: "Buyer" | "Seller") {
  return contract[`rating${userType}`] !== 0 ? (
    <Bubble
      iconId={contract[`rating${userType}`] === 1 ? "thumbsUp" : "thumbsDown"}
      color={"primary"}
      ghost
    />
  ) : undefined;
}

function getPaymentMethod({ paymentMethod }: Contract) {
  if (isCashTrade(paymentMethod))
    return <EventName paymentMethod={paymentMethod} />;
  return i18n(`paymentMethod.${paymentMethod}`);
}

function EventName({ paymentMethod }: { paymentMethod: `cash.${string}` }) {
  const { contract, view } = useContractContext();
  const eventName = useCashPaymentMethodName(paymentMethod);
  return (
    <SummaryItem.Text
      value={String(eventName)}
      copyable={view === "buyer" && !contract.releaseTxId}
    />
  );
}

function PaidToWallet({ contract }: { contract: Contract }) {
  const { offer } = useOfferDetail(getBuyOfferIdFromContract(contract));
  const address = offer && isBuyOffer(offer) ? offer.releaseAddress : undefined;
  const walletLabel = useWalletLabel({ address, isPayoutWallet: true });

  return <>{walletLabel}</>;
}

function YouShouldPay({ contract }: { contract: Contract }) {
  return (
    <SummaryItem.Text
      value={getPrice(contract)}
      copyable={true}
      copyValue={String(contract.price)}
    />
  );
}
