import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, FlatList, View } from "react-native";
import { TradeRequestForBuyOffer } from "../../../peach-api/src/private/offer/getTradeRequestsForBuyOffer";
import { Header } from "../../components/Header";
import { Screen } from "../../components/Screen";
import { getPremiumOfMatchedOffer } from "../../components/matches/getPremiumOfMatchedOffer";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { PeachText } from "../../components/text/PeachText";
import {
  CENT,
  SATSINBTC,
  fullScreenTabNavigationScreenOptions,
} from "../../constants";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useOfferDetail } from "../../hooks/query/useOfferDetail";
import { useBitcoinPrices } from "../../hooks/useBitcoinPrices";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { CancelOfferPopup } from "../../popups/CancelOfferPopup";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { round } from "../../utils/math/round";
import { isSellOffer } from "../../utils/offer/isSellOffer";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { peachAPI } from "../../utils/peachAPI";
import { LoadingScreen } from "../loading/LoadingScreen";
import { MarketInfo } from "../offerPreferences/components/MarketInfo";
import { useUser } from "../publicProfile/useUser";
import { NoMatchesYet } from "../search/NoMatchesYet";
import { useOfferMatches } from "../search/hooks/useOfferMatches";
import { OfferSummaryCard } from "./OfferSummaryCard";

const OfferTab = createMaterialTopTabNavigator();

export function Explore() {
  const { offerId } = useRoute<"explore">().params;
  return (
    <Screen style={tw`px-0`} header={<ExploreHeader />}>
      <OfferTab.Navigator
        initialRouteName="acceptTrade"
        screenOptions={fullScreenTabNavigationScreenOptions}
        sceneContainerStyle={[tw`px-sm`, tw`md:px-md`]}
      >
        <OfferTab.Screen
          name="acceptTrade"
          options={{
            title: "accept trade",
          }}
          children={() => <AcceptTrade offerId={offerId} />}
        />
        <OfferTab.Screen
          name="requestTrade"
          options={{
            title: "request trade",
          }}
          children={() => <RequestTrade offerId={offerId} />}
        />
      </OfferTab.Navigator>
    </Screen>
  );
}

function RequestTrade({ offerId }: { offerId: string }) {
  const {
    allMatches: matches,
    isPending,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useOfferMatches(offerId);

  const hasMatches = matches.length > 0;
  if (isPending) return <LoadingScreen />;
  return (
    <>
      {hasMatches ? (
        <FlatList
          ListHeaderComponent={<BuyOfferMarketInfo offerId={offerId} />}
          data={matches}
          onRefresh={() => refetch()}
          refreshing={isRefetching}
          keyExtractor={(item) => item.offerId}
          renderItem={({ item }) => (
            <ExploreCard match={item} offerId={offerId} />
          )}
          onEndReachedThreshold={0.5}
          onEndReached={() => fetchNextPage()}
          contentContainerStyle={tw`gap-10px`}
        />
      ) : (
        <View style={tw`items-center justify-center flex-1 gap-4`}>
          <BuyOfferMarketInfo offerId={offerId} />
          <PeachText style={tw`text-center subtitle-2`}>
            {i18n("search.weWillNotifyYou")}
          </PeachText>
        </View>
      )}
    </>
  );
}

function TradeRequestSummaryCard({
  tradeRequest,
  offerId,
}: {
  tradeRequest: TradeRequestForBuyOffer;
  offerId: string;
}) {
  const {
    currency,
    userId,
    fiatPrice,
    paymentMethod,
    symmetricKeyEncrypted,
    amount,
    requestingOfferId,
  } = tradeRequest;
  const { user } = useUser(userId);
  const { offer } = useOfferDetail(offerId);
  const { data: marketPrices } = useMarketPrices();
  const navigation = useStackNavigation();
  if (!user || !offer || !marketPrices) {
    return <ActivityIndicator />;
  }
  const onPress = () =>
    navigation.navigate("tradeRequestForBuyOffer", {
      userId,
      offerId,
      amount,
      fiatPrice,
      currency,
      paymentMethod,
      symmetricKeyEncrypted,
      requestingOfferId,
    });
  const bitcoinPrice = marketPrices[currency];
  if (!bitcoinPrice) return <ActivityIndicator />;

  const bitcoinPriceOfOffer = fiatPrice / (amount / SATSINBTC);
  const premium = round((bitcoinPriceOfOffer / bitcoinPrice - 1) * CENT, 2);

  return (
    <OfferSummaryCard
      user={user}
      amount={amount}
      price={fiatPrice}
      currency={currency}
      premium={premium}
      instantTrade={false}
      tradeRequested={false}
      onPress={onPress}
    />
  );
}

function ExploreCard({ match, offerId }: { match: Match; offerId: string }) {
  const {
    matched,
    amount,
    user,
    instantTrade,
    matchedPrice,
    selectedCurrency,
  } = match;
  const { data: priceBook } = useMarketPrices();
  const premium =
    matched && matchedPrice && selectedCurrency
      ? getPremiumOfMatchedOffer(
          { amount, price: matchedPrice, currency: selectedCurrency },
          priceBook,
        )
      : match.premium;
  const { fiatPrice } = useBitcoinPrices(amount);
  const navigation = useStackNavigation();
  const onPress = () => {
    navigation.navigate("matchDetails", { matchId: match.offerId, offerId });
  };

  return (
    <OfferSummaryCard
      user={user}
      amount={amount}
      price={fiatPrice}
      currency={selectedCurrency!}
      premium={premium}
      instantTrade={instantTrade}
      tradeRequested={matched}
      onPress={onPress}
    />
  );
}

function BuyOfferMarketInfo({ offerId }: { offerId: string }) {
  const { offer } = useOfferDetail(offerId);

  if (offer && isSellOffer(offer)) {
    throw new Error("Offer should be a buy offer");
  }

  return (
    <MarketInfo
      type={"sellOffers"}
      meansOfPayment={offer?.meansOfPayment}
      maxPremium={offer?.maxPremium || undefined}
      minReputation={offer?.minReputation || undefined}
      buyAmountRange={offer?.amount}
    />
  );
}

function AcceptTrade({ offerId }: { offerId: string }) {
  const { data } = useQuery({
    queryKey: ["tradeRequests", offerId],
    queryFn: async () => {
      const { result, error } =
        await peachAPI.private.offer.getTradeRequestsForBuyOffer({
          offerId,
        });
      if (error || !result) {
        throw new Error(error?.error || "Failed to fetch trade requests");
      }
      return result;
    },
  });

  const tradeRequests = data?.tradeRequests || [];
  const hasMatches = tradeRequests.length > 0;
  if (hasMatches) {
    return (
      <FlatList
        data={tradeRequests}
        keyExtractor={({ userId, currency, paymentMethod }) =>
          `${userId}-${currency}-${paymentMethod}`
        }
        renderItem={({ item }) => (
          <TradeRequestSummaryCard tradeRequest={item} offerId={offerId} />
        )}
        contentContainerStyle={tw`gap-10px py-10px`}
      />
    );
  }

  return <NoMatchesYet />;
}

function ExploreHeader() {
  const navigation = useStackNavigation();
  const { offerId } = useRoute<"explore">().params;
  const setPopup = useSetPopup();

  const cancelOffer = () => setPopup(<CancelOfferPopup offerId={offerId} />);
  const goToPreferences = () =>
    navigation.navigate("editBuyPreferences", { offerId });

  return (
    <Header
      icons={[
        // { ...headerIcons.buyFilter, onPress: showSortAndFilterPopup },
        { ...headerIcons.buyPreferences, onPress: goToPreferences },
        { ...headerIcons.cancel, onPress: cancelOffer },
      ]}
      title={`offer ${offerIdToHex(offerId)}`}
    />
  );
}
