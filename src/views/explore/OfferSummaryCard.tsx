import { useQuery } from "@tanstack/react-query";
import { TouchableOpacity, View } from "react-native";
import {
  BuyOfferSummary,
  SellOfferSummary,
} from "../../../peach-api/src/@types/match";
import { horizontalBadgePadding } from "../../components/InfoContainer";
import { Loading } from "../../components/Loading";
import { PeachyBackground } from "../../components/PeachyBackground";
import { BTCAmount } from "../../components/bitcoin/BTCAmount";
import { Badges } from "../../components/matches/components/Badges";
import { getPremiumOfMatchedOffer } from "../../components/matches/getPremiumOfMatchedOffer";
import { PeachText } from "../../components/text/PeachText";
import { PriceFormat } from "../../components/text/PriceFormat";
import { CENT, NEW_USER_TRADE_THRESHOLD } from "../../constants";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useBitcoinPrices } from "../../hooks/useBitcoinPrices";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { peachAPI } from "../../utils/peachAPI";
import { Rating } from "../settings/profile/profileOverview/Rating";

export function SellOfferSummaryIdCard({
  offerId,
  requestingOfferId,
}: {
  offerId: string;
  requestingOfferId?: string;
}) {
  const { data: offerSummary } = useQuery({
    queryKey: ["sellOfferSummary", offerId],
    queryFn: async () => {
      const { result, error } =
        await peachAPI.private.offer.getSellOfferSummary({ offerId });
      if (error) throw error;
      return result;
    },
  });
  if (!offerSummary) return <Loading />;

  return (
    <SellOfferSummaryCard
      offerSummary={offerSummary}
      requestingOfferId={requestingOfferId}
    />
  );
}

function SellOfferSummaryCard({
  offerSummary,
  requestingOfferId,
}: {
  offerSummary: SellOfferSummary;
  requestingOfferId?: string;
}) {
  const {
    tradeRequested,
    amount,
    user,
    canInstantTrade,
    requestedPrice,
    selectedCurrency,
    offerId,
  } = offerSummary;
  const { data: priceBook } = useMarketPrices();
  const premium =
    tradeRequested && requestedPrice && selectedCurrency
      ? getPremiumOfMatchedOffer(
          { amount, price: requestedPrice, currency: selectedCurrency },
          priceBook,
        )
      : offerSummary.premium;
  const { fiatPrice, displayCurrency } = useBitcoinPrices(amount);
  const navigation = useStackNavigation();
  const onPress = () =>
    navigation.navigateDeprecated("sellOfferDetails", {
      offerId,
      requestingOfferId,
    });

  const isNewUser = user.openedTrades < NEW_USER_TRADE_THRESHOLD;
  const { isDarkMode } = useThemeStore();

  return (
    <TouchableOpacity
      style={[
        tw`justify-center overflow-hidden border rounded-2xl`,
        isDarkMode
          ? tw`bg-card`
          : tw`border border-primary-main bg-primary-background-light`,
        tradeRequested && tw`border-2 border-success-main`,
      ]}
      onPress={onPress}
    >
      {canInstantTrade && (
        <View style={tw`overflow-hidden rounded-md`}>
          <PeachyBackground />
          <PeachText
            style={tw`text-center py-2px subtitle-2 text-primary-background-light`}
          >
            {i18n("offerPreferences.instantTrade")}
          </PeachText>
        </View>
      )}
      <View style={tw`justify-center py-2 px-9px`}>
        <View
          style={[
            tw`flex-row items-center justify-between`,
            { paddingLeft: horizontalBadgePadding },
          ]}
        >
          <Rating rating={user.rating} isNewUser={isNewUser} />
          <BTCAmount amount={amount} size="small" />
        </View>
        <View
          style={[
            tw`flex-row items-center justify-between`,
            isNewUser && tw`justify-end`,
          ]}
        >
          {!isNewUser && (
            <Badges id={user.id} unlockedBadges={user.medals} disabled />
          )}
          <PeachText style={tw`text-center`}>
            <PriceFormat
              style={tw`tooltip`}
              currency={selectedCurrency ?? displayCurrency}
              amount={requestedPrice ?? fiatPrice * (1 + premium / CENT)}
            />
            <PeachText
              style={tw.style(
                isDarkMode ? "text-primary-mild-2" : "text-black-65",
              )}
            >
              {" "}
              ({premium >= 0 ? "+" : ""}
              {premium}%)
            </PeachText>
          </PeachText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function BuyOfferSummaryIdCard({
  offerId,
  requestingOfferId,
}: {
  offerId: string;
  requestingOfferId?: string;
}) {
  const { data: offerSummary } = useQuery({
    queryKey: ["buyOfferSummary", offerId],
    queryFn: async () => {
      const { result, error } = await peachAPI.private.offer.getBuyOfferSummary(
        { offerId },
      );
      if (error) throw error;
      return result;
    },
  });
  if (!offerSummary) return <Loading />;

  return (
    <BuyOfferSummaryCard
      offerSummary={offerSummary}
      offerId={offerId}
      requestingOfferId={requestingOfferId}
    />
  );
}

function BuyOfferSummaryCard({
  offerSummary,
  offerId,
  requestingOfferId,
}: {
  offerSummary: BuyOfferSummary;
  offerId: string;
  requestingOfferId?: string;
}) {
  const {
    tradeRequested,
    amount: amountRange,
    user,
    canInstantTrade,
    requestedPrice,
    selectedCurrency,
  } = offerSummary;
  const amount = amountRange[1];
  const { data: priceBook } = useMarketPrices();
  const premium =
    tradeRequested && requestedPrice && selectedCurrency
      ? getPremiumOfMatchedOffer(
          { amount, price: requestedPrice, currency: selectedCurrency },
          priceBook,
        )
      : offerSummary.premium;
  const { fiatPrice, displayCurrency } = useBitcoinPrices(amount);
  const navigation = useStackNavigation();
  const price = requestedPrice ?? fiatPrice * (1 + premium / CENT);
  const onPress = () =>
    navigation.navigateDeprecated("buyOfferDetails", {
      offerId,
      amount,
      premium,
      requestingOfferId,
    });

  return (
    <OfferSummaryCard
      {...{ user, amount, price, premium, tradeRequested, onPress }}
      currency={selectedCurrency ?? displayCurrency}
      instantTrade={canInstantTrade}
    />
  );
}

export function OfferSummaryCard({
  user,
  amount,
  price,
  currency,
  premium,
  instantTrade,
  tradeRequested,
  onPress,
}: {
  user: { id: string; rating: number; medals: Medal[]; openedTrades: number };
  amount: number;
  price: number;
  currency: Currency;
  premium: number;
  instantTrade: boolean;
  tradeRequested: boolean;
  onPress: () => void;
}) {
  const isNewUser = user.openedTrades < NEW_USER_TRADE_THRESHOLD;
  const { isDarkMode } = useThemeStore();
  return (
    <TouchableOpacity
      style={[
        tw`justify-center overflow-hidden rounded-2xl`,
        isDarkMode
          ? tw`bg-card`
          : tw`border bg-primary-background-light border-primary-main`,
        tradeRequested && tw`border-2 border-success-main`,
      ]}
      onPress={onPress}
    >
      {instantTrade && (
        <View style={tw`overflow-hidden rounded-md`}>
          <PeachyBackground />
          <PeachText
            style={tw`text-center py-2px subtitle-2 text-primary-background-light`}
          >
            {i18n("offerPreferences.instantTrade")}
          </PeachText>
        </View>
      )}
      <View style={tw`justify-center py-2 px-9px`}>
        <View
          style={[
            tw`flex-row items-center justify-between`,
            { paddingLeft: horizontalBadgePadding },
          ]}
        >
          <Rating rating={user.rating} isNewUser={isNewUser} />
          <BTCAmount amount={amount} size="small" />
        </View>
        <View
          style={[
            tw`flex-row items-center justify-between`,
            isNewUser && tw`justify-end`,
          ]}
        >
          {!isNewUser && (
            <Badges id={user.id} unlockedBadges={user.medals} disabled />
          )}
          <PeachText style={tw`text-center`}>
            <PriceFormat
              style={tw`tooltip`}
              currency={currency}
              amount={price}
            />
            <PeachText
              style={tw.style(
                isDarkMode ? "text-primary-mild-2" : "text-black-65",
              )}
            >
              {" "}
              ({premium >= 0 ? "+" : ""}
              {premium}%)
            </PeachText>
          </PeachText>
        </View>
      </View>
    </TouchableOpacity>
  );
}
