import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, FlatList } from "react-native";
import { TradeRequestForSellOffer } from "../../../peach-api/src/private/offer/getTradeRequestsForSellOffer";
import { Header } from "../../components/Header";
import { Screen } from "../../components/Screen";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import {
  CENT,
  MSINASECOND,
  SATSINBTC,
  TIME_UNTIL_REFRESH_LONGER_SECONDS,
  fullScreenTabNavigationScreenOptions,
} from "../../constants";
import { tradeRequestKeys } from "../../hooks/query/tradeRequestKeys";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useSellOfferPreferences } from "../../hooks/query/useSellOfferPreferences";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { CancelOfferPopup } from "../../popups/CancelOfferPopup";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { round } from "../../utils/math/round";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { peachAPI } from "../../utils/peachAPI";
import { OfferSummaryCard } from "../explore/OfferSummaryCard";
import { LoadingScreen } from "../loading/LoadingScreen";
import { ExpressSell } from "../offerPreferences/ExpressSell";
import { useUser } from "../publicProfile/useUser";
import { useOfferMatches } from "../search/hooks/useOfferMatches";
import { NoMatchesYet } from "./NoMatchesYet";

const OfferTab = createMaterialTopTabNavigator();

export function Search() {
  // THIS IS THE MENU OF A SELL OFFER
  const { offerId } = useRoute<"search">().params;
  return (
    <Screen style={tw`px-0`} header={<SearchHeader />}>
      <OfferTab.Navigator
        initialRouteName="acceptTrade"
        screenOptions={fullScreenTabNavigationScreenOptions}
        sceneContainerStyle={[tw`px-sm`, tw`md:px-md`]}
      >
        <OfferTab.Screen
          name="acceptTrade"
          options={{
            title: i18n("search.acceptTrade"),
          }}
          children={() => <AcceptTrade offerId={offerId} />}
        />
        <OfferTab.Screen
          name="requestTrade"
          options={{
            title: i18n("search.requestTrade"),
          }}
          children={() => <ExpressSell requestingOfferId={offerId} />}
        />
      </OfferTab.Navigator>
    </Screen>
  );
}

function AcceptTrade({ offerId }: { offerId: string }) {
  const {
    allMatches: matches,
    isLoading: isLoadingMatches,
    fetchNextPage,
    refetch: refetchMatches,
    isRefetching: isRefetchingMatches,
  } = useOfferMatches(offerId, TIME_UNTIL_REFRESH_LONGER_SECONDS * MSINASECOND);
  const {
    data,
    isLoading: isLoadingTradeRequests,
    refetch: refetchTradeRequests,
    isRefetching: isRefetchingTradeRequests,
  } = useQuery({
    queryKey: tradeRequestKeys.tradeRequestsForSellOffer(offerId),
    queryFn: async () => {
      const { result, error } =
        await peachAPI.private.offer.getTradeRequestsForSellOffer({
          offerId,
        });
      if (error || !result) {
        throw new Error(error?.error || "Failed to fetch trade requests");
      }
      return result;
    },
    refetchInterval: TIME_UNTIL_REFRESH_LONGER_SECONDS * MSINASECOND,
  });

  const refetch = () => Promise.all([refetchMatches(), refetchTradeRequests()]);

  const isRefetching = isRefetchingMatches || isRefetchingTradeRequests;

  const tradeRequests = data || [];
  const allRequests = [...matches, ...tradeRequests];
  const hasMatches = allRequests.length > 0;
  const navigation = useStackNavigation();
  if (isLoadingMatches || isLoadingTradeRequests) return <LoadingScreen />;

  if (hasMatches) {
    return (
      <FlatList
        data={allRequests}
        onRefresh={() => refetch()}
        refreshing={isRefetching}
        keyExtractor={(item) => {
          if ("offerId" in item) {
            return item.offerId;
          }
          return `${item.userId}-${item.currency}-${item.paymentMethod}-${item.requestingOfferId}`;
        }}
        renderItem={({ item }) => {
          if ("offerId" in item) {
            return (
              <OfferSummaryCard
                user={item.user}
                amount={item.amount}
                // @ts-ignore
                price={item.matchedPrice}
                currency={item.selectedCurrency || "EUR"}
                premium={item.premium}
                instantTrade={item.instantTrade}
                tradeRequested={item.matched}
                onPress={() => {
                  navigation.navigate("tradeRequestForSellOffer", {
                    userId: item.user.id,
                    offerId,
                    amount: item.amount,
                    // @ts-ignore
                    fiatPrice: item.matchedPrice,
                    currency: item.selectedCurrency || "EUR",
                    // @ts-ignore
                    paymentMethod: item.selectedPaymentMethod,
                    symmetricKeyEncrypted: item.symmetricKeyEncrypted,
                    isMatch: true,
                    matchingOfferId: item.offerId,
                  });
                }}
              />
            );
          }
          return (
            <TradeRequestSummaryCard tradeRequest={item} offerId={offerId} />
          );
        }}
        onEndReachedThreshold={0.5}
        onEndReached={() => fetchNextPage()}
        style={tw`flex-1 py-10px`}
        contentContainerStyle={tw`gap-10px`}
      />
    );
  }
  return <NoMatchesYet />;
}

function TradeRequestSummaryCard({
  tradeRequest,
  offerId,
}: {
  tradeRequest: TradeRequestForSellOffer;
  offerId: string;
}) {
  const {
    currency,
    userId,
    fiatPrice,
    paymentMethod,
    symmetricKeyEncrypted,
    requestingOfferId,
  } = tradeRequest;
  const { user } = useUser(userId);
  const { data: offer } = useSellOfferPreferences(offerId);
  const { data: marketPrices } = useMarketPrices();
  const navigation = useStackNavigation();
  const bitcoinPrice = marketPrices?.[currency];
  if (!user || !offer || !marketPrices || !bitcoinPrice) {
    return <ActivityIndicator />;
  }
  const onPress = () =>
    navigation.navigate("tradeRequestForSellOffer", {
      userId,
      offerId,
      amount: offer.amount,
      fiatPrice,
      currency,
      paymentMethod,
      symmetricKeyEncrypted,
      requestingOfferId,
    });

  const bitcoinPriceOfOffer = fiatPrice / (offer.amount / SATSINBTC);
  const premium = round((bitcoinPriceOfOffer / bitcoinPrice - 1) * CENT, 2);

  return (
    <OfferSummaryCard
      user={user}
      amount={offer.amount}
      price={fiatPrice}
      currency={currency}
      premium={premium}
      instantTrade={false}
      tradeRequested={false}
      onPress={onPress}
    />
  );
}

function SearchHeader() {
  const navigation = useStackNavigation();
  const { offerId } = useRoute<"search">().params;
  const setPopup = useSetPopup();

  const goToPreferences = () => navigation.navigate("editPremium", { offerId });

  const cancelOffer = () => setPopup(<CancelOfferPopup offerId={offerId} />);

  return (
    <Header
      icons={[
        { ...headerIcons.sellPreferences, onPress: goToPreferences },
        { ...headerIcons.cancel, onPress: cancelOffer },
      ]}
      title={`offer ${offerIdToHex(offerId)}`}
    />
  );
}
