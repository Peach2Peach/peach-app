import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, FlatList } from "react-native";
import { TradeRequestForBuyOffer } from "../../../peach-api/src/private/offer/getTradeRequestsForBuyOffer";
import { Header } from "../../components/Header";
import { Screen } from "../../components/Screen";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import {
  CENT,
  MSINASECOND,
  SATSINBTC,
  TIME_UNTIL_REFRESH_SECONDS,
  fullScreenTabNavigationScreenOptions,
} from "../../constants";
import { tradeRequestKeys } from "../../hooks/query/tradeRequestKeys";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useOfferDetail } from "../../hooks/query/useOfferDetail";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { CancelOfferPopup } from "../../popups/CancelOfferPopup";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { round } from "../../utils/math/round";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { peachAPI } from "../../utils/peachAPI";
import { ExpressBuy } from "../home/ExpressBuy";
import { useUser } from "../publicProfile/useUser";
import { NoMatchesYet } from "../search/NoMatchesYet";
import { OfferSummaryCard } from "./OfferSummaryCard";

const OfferTab = createMaterialTopTabNavigator();

export function Explore() {
  // THIS IS THE MENU OF A BUY OFFER
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
          children={() => <ExpressBuy requestingOfferId={offerId} />}
        />
      </OfferTab.Navigator>
    </Screen>
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

function AcceptTrade({ offerId }: { offerId: string }) {
  const { data } = useQuery({
    queryKey: tradeRequestKeys.tradeRequestsForBuyOffer(offerId),
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
    refetchInterval: TIME_UNTIL_REFRESH_SECONDS * MSINASECOND,
  });

  const tradeRequests = data || [];
  const hasMatches = tradeRequests.length > 0;
  if (hasMatches) {
    return (
      <FlatList
        data={tradeRequests}
        keyExtractor={({
          userId,
          currency,
          paymentMethod,
          requestingOfferId,
        }) => `${userId}-${currency}-${paymentMethod}-${requestingOfferId}`}
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
