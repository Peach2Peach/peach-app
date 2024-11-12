import { useQuery } from "@tanstack/react-query";
import { memo } from "react";
import { View } from "react-native";
import { ContractSummary } from "../../../../peach-api/src/@types/contract";
import { OfferSummary } from "../../../../peach-api/src/@types/offer";
import { IconType } from "../../../assets/icons";
import { Icon } from "../../../components/Icon";
import { Placeholder } from "../../../components/Placeholder";
import { BTCAmount } from "../../../components/bitcoin/BTCAmount";
import { BitcoinAmountInfo } from "../../../components/statusCard/BitcoinAmountInfo";
import { StatusCard } from "../../../components/statusCard/StatusCard";
import { StatusInfo } from "../../../components/statusCard/StatusInfo";
import { infoContainerStyle } from "../../../components/statusCard/infoContainerStyle";
import { statusCardStyles } from "../../../components/statusCard/statusCardStyles";
import { FixedHeightText } from "../../../components/text/FixedHeightText";
import { PeachText } from "../../../components/text/PeachText";
import { useGoToOfferOrContract } from "../../../hooks/useGoToOfferOrContract";
import { useTradeNavigation } from "../../../hooks/useTradeNavigation";
import tw from "../../../styles/tailwind";
import { contractIdFromHex } from "../../../utils/contract/contractIdFromHex";
import { contractIdToHex } from "../../../utils/contract/contractIdToHex";
import { isDisplayContractId } from "../../../utils/contract/isDisplayContractId";
import { getShortDateFormat } from "../../../utils/date/getShortDateFormat";
import i18n from "../../../utils/i18n";
import { getOffer } from "../../../utils/offer/getOffer";
import { offerIdFromHex } from "../../../utils/offer/offerIdFromHex";
import { offerIdToHex } from "../../../utils/offer/offerIdToHex";
import { groupChars } from "../../../utils/string/groupChars";
import { priceFormat } from "../../../utils/string/priceFormat";
import { useWalletState } from "../../../utils/wallet/walletStore";
import {
    TradeTheme,
    getThemeForTradeItem,
} from "../utils/getThemeForTradeItem";
import { isContractSummary } from "../utils/isContractSummary";
import { isPastOffer } from "../utils/isPastOffer";
import { isTradeStatus } from "../utils/isTradeStatus";
import { statusIcons } from "../utils/statusIcons";

type Props = {
  item: OfferSummary | ContractSummary;
};
const Label = memo(
  ({ item, color }: Props & { color: TradeTheme["color"] }) => {
    const isContract = isContractSummary(item);
    const isWaiting = color === "primary-mild" && isContract;
    const labelIconId = getActionIcon(item, isWaiting);
    const label = getActionLabel(item, isWaiting);
    const labelIcon = labelIconId && (
      <Icon
        id={labelIconId}
        size={17}
        color={tw.color(statusCardStyles.text[color])}
      />
    );
    const unreadMessages = isContract ? item.unreadMessages : undefined;
    if (!label) return null;
    return (
      <View
        style={[
          tw`flex-row items-center justify-center gap-1 px-4 py-6px`,
          statusCardStyles.bg[color],
        ]}
      >
        {!!unreadMessages && <Placeholder style={tw`w-6 h-6`} />}
        <View style={tw`flex-row items-center justify-center flex-1 gap-1`}>
          {labelIcon}
          <PeachText
            style={[tw`subtitle-1`, tw.style(statusCardStyles.text[color])]}
          >
            {label}
          </PeachText>
        </View>
        {!!unreadMessages && (
          <View style={[tw`items-center justify-center w-7 h-7`]}>
            <Icon
              id="messageFull"
              size={24}
              color={tw.color("primary-background-light-color")}
            />
            <PeachText style={tw`absolute text-center font-baloo-bold`}>
              {unreadMessages}
            </PeachText>
          </View>
        )}
      </View>
    );
  },
);
const TradeStatusInfo = memo(({ item, iconId, color }: Props & TradeTheme) => {
  const { data } = useSubtext(item);
  const subtext = data || getFallbackSubtext(item);
  const replaced = "newTradeId" in item && !!item.newTradeId;
  const title = getTitle(item);

  if (replaced) {
    return <ReplacedTradeStatusInfo title={title} subtext={subtext} />;
  }

  return (
    <StatusInfo
      icon={
        isPastOffer(item.tradeStatus) ? (
          <Icon
            id={iconId}
            size={16}
            color={tw.color(statusCardStyles.border[color])}
          />
        ) : undefined
      }
      title={title}
      subtext={subtext}
    />
  );
});
const AmountInfo = memo(({ item }: Props) => {
  const { type, amount, currency, premium, price } = getInfoPropsWithType({
    amount: item.amount,
    currency: "currency" in item ? item.currency : undefined,
    premium:
      "premium" in item && typeof item.premium === "number"
        ? item.premium
        : undefined,
    price: "price" in item ? item.price : undefined,
    replaced: "newTradeId" in item && !!item.newTradeId,
  });
  return (
    <>
      {type === "range" ? (
        <RangeInfo amount={amount} />
      ) : type === "fiatAmount" ? (
        <FiatAmountInfo amount={amount} currency={currency} price={price} />
      ) : type === "amount" ? (
        <BitcoinAmountInfo amount={amount} premium={premium} />
      ) : undefined}
    </>
  );
});

export function TradeItem({ item }: Props) {
  const onPress = useTradeNavigation(item);

  const { color, iconId } = getThemeForTradeItem(item);
  return (
    <StatusCard
      onPress={onPress}
      color={color}
      statusInfo={<TradeStatusInfo item={item} iconId={iconId} color={color} />}
      amountInfo={<AmountInfo item={item} />}
      label={<Label item={item} color={color} />}
    />
  );
}

function ReplacedTradeStatusInfo({
  title,
  subtext,
}: {
  title: string;
  subtext: string;
}) {
  const goToNewOffer = useGoToOfferOrContract();
  const onPress = async () => {
    const newOfferOrContractID = isDisplayContractId(subtext)
      ? contractIdFromHex(subtext)
      : offerIdFromHex(subtext);
    await goToNewOffer(newOfferOrContractID);
  };
  return (
    <StatusInfo
      icon={
        <Icon id="cornerDownRight" color={tw.color("black-100")} size={17} />
      }
      title={title}
      titleStyle={tw`text-black-50`}
      subtext={subtext}
      subtextStyle={tw`underline subtitle-2 text-black-100`}
      onPress={onPress}
    />
  );
}

function RangeInfo({ amount }: { amount: [number, number] }) {
  return (
    <View style={tw`items-center -gap-1`}>
      <BTCAmount size="small" amount={amount[0]} />
      <PeachText
        style={tw`font-baloo-medium text-12px leading-19px text-black-50`}
      >
        ~
      </PeachText>
      <BTCAmount size="small" amount={amount[1]} />
    </View>
  );
}

const GROUP_SIZE = 3;
function FiatAmountInfo({
  amount,
  currency,
  price,
}: {
  amount: number;
  currency: Currency;
  price: number;
}) {
  return (
    <View style={[infoContainerStyle, tw`gap-6px`]}>
      <BTCAmount size="small" amount={amount} />
      <FixedHeightText style={tw`body-m text-black-65`} height={17}>
        {currency === "SAT"
          ? groupChars(String(price), GROUP_SIZE)
          : priceFormat(price)}
         {currency}
      </FixedHeightText>
    </View>
  );
}

type InfoProps = {
  amount?: number | [number, number];
  price?: number;
  premium?: number;
  currency?: Currency;
  replaced?: boolean;
};

type Empty = {
  type: "empty";
} & Partial<InfoProps>;
type Amount = {
  type: "amount";
  amount: number;
} & Partial<InfoProps>;
const isAmount = (props: InfoProps): props is Omit<Amount, "type"> =>
  typeof props.amount === "number";
type FiatAmount = {
  type: "fiatAmount";
  amount: number;
} & Required<InfoProps>;
const isFiatAmount = (props: InfoProps): props is Omit<FiatAmount, "type"> =>
  typeof props.amount === "number" &&
  props.price !== undefined &&
  props.currency !== undefined;
type Range = {
  type: "range";
  amount: [number, number];
} & Partial<InfoProps>;
const isRange = (props: InfoProps): props is Omit<Range, "type"> =>
  Array.isArray(props.amount);

function getInfoPropsWithType(
  props: InfoProps,
): Empty | FiatAmount | Range | Amount {
  if (props.replaced) return { ...props, type: "empty" };
  if (isRange(props)) return { ...props, type: "range" };
  if (isFiatAmount(props)) return { ...props, type: "fiatAmount" };
  if (isAmount(props)) return { ...props, type: "amount" };
  return { ...props, type: "empty" };
}

function getTitle(item: OfferSummary | ContractSummary) {
  const title = isContractSummary(item)
    ? contractIdToHex(item.id)
    : offerIdToHex(item.id);
  if ("newTradeId" in item && !!item.newTradeId) {
    return `${title} (${i18n("offer.canceled")})`;
  }
  return title;
}

function useSubtext(item: OfferSummary | ContractSummary) {
  return useQuery({
    queryKey: ["tradeItem", "subtext", item.id],
    queryFn: () => getSubtext(item),
    placeholderData: getFallbackSubtext(item),
  });
}

function getFallbackSubtext(item: OfferSummary | ContractSummary) {
  const date = new Date(
    "paymentMade" in item
      ? item.paymentMade || item.creationDate
      : item.creationDate,
  );
  return getShortDateFormat(date);
}

async function getSubtext(item: OfferSummary | ContractSummary) {
  const newOfferId =
    "newTradeId" in item && !!item.newTradeId ? item.newTradeId : undefined;
  const newContractId = newOfferId
    ? (await getOffer(newOfferId))?.contractId
    : undefined;
  const newTradeId = newContractId
    ? contractIdToHex(newContractId)
    : newOfferId
      ? offerIdToHex(newOfferId)
      : undefined;

  return newTradeId || getFallbackSubtext(item);
}

function getActionLabel(
  tradeSummary: OfferSummary | ContractSummary,
  isWaiting: boolean,
) {
  const { tradeStatus } = tradeSummary;
  const translationStatusKey = isWaiting ? "waiting" : tradeStatus;

  if (!isTradeStatus(tradeSummary.tradeStatus))
    return i18n("offer.requiredAction.unknown");

  if (isContractSummary(tradeSummary)) {
    const { unreadMessages, type, disputeWinner } = tradeSummary;
    const counterparty = type === "bid" ? "seller" : "buyer";
    const viewer = type === "bid" ? "buyer" : "seller";

    if (isPastOffer(tradeStatus)) {
      return unreadMessages > 0 ? i18n("yourTrades.newMessages") : undefined;
    }
    if (disputeWinner) {
      if (tradeStatus === "releaseEscrow")
        return i18n("offer.requiredAction.releaseEscrow");
      if (tradeStatus === "payoutPending")
        return i18n("offer.requiredAction.payoutPending");
      return i18n(`offer.requiredAction.${translationStatusKey}.dispute`);
    }

    if (tradeStatus === "payoutPending")
      return i18n("offer.requiredAction.payoutPending");
    if (tradeStatus === "confirmCancelation")
      return i18n(`offer.requiredAction.confirmCancelation.${viewer}`);

    return isWaiting || tradeStatus === "rateUser"
      ? i18n(`offer.requiredAction.${translationStatusKey}.${counterparty}`)
      : i18n(`offer.requiredAction.${translationStatusKey}`);
  }

  if (isPastOffer(tradeStatus)) {
    return undefined;
  }

  if (
    tradeStatus === "fundEscrow" &&
    tradeSummary.id &&
    useWalletState.getState().getFundMultipleByOfferId(tradeSummary.id)
  ) {
    return i18n("offer.requiredAction.fundMultipleEscrow");
  }

  return i18n(`offer.requiredAction.${tradeStatus}`);
}

function getActionIcon(
  tradeSummary: Pick<OfferSummary | ContractSummary, "tradeStatus">,
  isWaiting: boolean,
): IconType | undefined {
  if (isPastOffer(tradeSummary.tradeStatus)) {
    return undefined;
  }
  if (isContractSummary(tradeSummary) && tradeSummary.disputeWinner) {
    if (tradeSummary.tradeStatus === "releaseEscrow") return "sell";
    return "alertOctagon";
  }

  if (tradeSummary.tradeStatus === "payoutPending")
    return statusIcons.payoutPending;

  if (!isTradeStatus(tradeSummary.tradeStatus)) return "refreshCw";

  return statusIcons[isWaiting ? "waiting" : tradeSummary.tradeStatus];
}
