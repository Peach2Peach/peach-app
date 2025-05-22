import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, FlatList, View } from "react-native";
import { TradeRequestForSellOffer } from "../../../peach-api/src/private/offer/getTradeRequestsForSellOffer";
import { Header } from "../../components/Header";
import { Screen } from "../../components/Screen";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import {
  CENT,
  SATSINBTC,
  TIME_UNTIL_REFRESH_LONGER_SECONDS,
  TIME_UNTIL_REFRESH_SECONDS,
  fullScreenTabNavigationScreenOptions,
} from "../../constants";
import { tradeRequestKeys } from "../../hooks/query/offerKeys";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useOfferDetail } from "../../hooks/query/useOfferDetail";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { CancelOfferPopup } from "../../popups/CancelOfferPopup";
import { queryClient } from "../../queryClient";
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
            title: i18n("search.acceptTrade"),
          }}
          children={() => <AcceptTrade offerId={offerId} />}
        />
        <OfferTab.Screen
          name="requestTrade"
          options={{
            title: i18n("search.requestTrade"),
          }}
          children={() => <RequestTrade offerId={offerId} />}
        />
      </OfferTab.Navigator>
    </Screen>
  );
}

function RequestTrade({ offerId }: { offerId: string }) {
  return <ExpressSell requestingOfferId={offerId} />;
}

function AcceptTrade({ offerId }: { offerId: string }) {
  const {
    allMatches: matches,
    isPending,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useOfferMatches(offerId, TIME_UNTIL_REFRESH_LONGER_SECONDS * 1000);
  const { data } = useQuery({
    queryKey: ["tradeRequests", offerId],
    queryFn: async () => {
      const { result, error } =
        await peachAPI.private.offer.getTradeRequestsForSellOffer({
          offerId,
        });
      if (error || !result) {
        throw new Error(error?.error || "Failed to fetch trade requests");
      }
      result.tradeRequests.map((value) => {
        queryClient.setQueryData(
          tradeRequestKeys.detail(offerId, value.userId),
          value,
        );
      });
      return result;
    },
    refetchInterval: TIME_UNTIL_REFRESH_SECONDS * 1000,
  });

  const tradeRequests = data?.tradeRequests || [];
  const hasMatches = matches.length > 0 || tradeRequests.length > 0;
  const navigation = useStackNavigation();
  if (isPending) return <LoadingScreen />;

  if (hasMatches) {
    return (
      <View style={tw`flex-1 py-10px`}>
        {matches.length > 0 && (
          <FlatList
            data={matches}
            onRefresh={() => refetch()}
            refreshing={isRefetching}
            keyExtractor={(item) => item.offerId}
            renderItem={({ item }) => (
              <OfferSummaryCard
                user={item.user}
                amount={item.amount}
                // @ts-ignore
                price={item.prices[item.selectedCurrency || "EUR"]}
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
                    fiatPrice: item.prices[item.selectedCurrency || "EUR"],
                    currency: item.selectedCurrency || "EUR",
                    // @ts-ignore
                    paymentMethod: item.selectedPaymentMethod,
                    symmetricKeyEncrypted: item.symmetricKeyEncrypted,
                    isMatch: true,
                    matchingOfferId: item.offerId,
                  });
                }}
              />
            )}
            onEndReachedThreshold={0.5}
            onEndReached={() => fetchNextPage()}
            contentContainerStyle={tw`gap-10px`}
          />
        )}
        <FlatList
          data={tradeRequests}
          onRefresh={() => refetch()}
          refreshing={isRefetching}
          keyExtractor={({
            userId,
            currency,
            paymentMethod,
            requestingOfferId,
          }) => `${userId}-${currency}-${paymentMethod}-${requestingOfferId}`}
          renderItem={({ item }) => (
            <TradeRequestSummaryCard tradeRequest={item} offerId={offerId} />
          )}
          contentContainerStyle={tw`gap-10px`}
        />
      </View>
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
  const { offer } = useOfferDetail(offerId);
  const { data: marketPrices } = useMarketPrices();
  const navigation = useStackNavigation();
  if (!user || !offer || typeof offer.amount !== "number" || !marketPrices) {
    return <ActivityIndicator />;
  }
  const onPress = () =>
    navigation.navigate("tradeRequestForSellOffer", {
      userId,
      offerId,
      amount: offer?.amount as number,
      fiatPrice,
      currency,
      paymentMethod,
      symmetricKeyEncrypted,
      requestingOfferId,
    });
  const bitcoinPrice = marketPrices[currency];
  if (!bitcoinPrice) return <ActivityIndicator />;

  const bitcoinPriceOfOffer = fiatPrice / (offer.amount / SATSINBTC);
  const premium = round((bitcoinPriceOfOffer / bitcoinPrice - 1) * CENT, 2);

  return (
    <OfferSummaryCard
      user={user}
      amount={offer?.amount}
      price={fiatPrice}
      currency={currency}
      premium={premium}
      instantTrade={false}
      tradeRequested={false}
      onPress={onPress}
    />
  );
}

function ExploreHeader() {
  const navigation = useStackNavigation();
  const { offerId } = useRoute<"explore">().params;
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
