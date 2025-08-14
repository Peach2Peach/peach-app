import { FlatList, TouchableOpacity, View } from "react-native";
import { BTCAmount } from "../../components/bitcoin/BTCAmount";
import { horizontalBadgePadding } from "../../components/InfoContainer";
import { Badges } from "../../components/matches/components/Badges";
import { PeachyBackground } from "../../components/PeachyBackground";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { Screen } from "../../components/Screen";
import { PeachText } from "../../components/text/PeachText";
import { PriceFormat } from "../../components/text/PriceFormat";
import { CENT, NEW_USER_TRADE_THRESHOLD } from "../../constants";
import { useExpressBuySellOffers } from "../../hooks/query/peach069/useExpressBuySellOffers";
import { useBitcoinPrices } from "../../hooks/useBitcoinPrices";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { ExpressBuySorters } from "../../popups/sorting/ExpressBuySorters";
import { useOfferPreferences } from "../../store/offerPreferenes";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { LoadingScreen } from "../loading/LoadingScreen";
import { BuyBitcoinHeader } from "../offerPreferences/components/BuyBitcoinHeader";
import { Rating } from "../settings/profile/profileOverview/Rating";

// export function ExpressBuyBrowseSellOffersOLD() {
//   const title = "Express Buy: Browse Sell Offers";

//   const expressBuyFilterByAmountRange = useOfferPreferences(
//     (state) => state.expressBuyFilterByAmountRange,
//   );

//   const [
//     expressBuyFilterByCurrencyList,
//     expressBuyFilterByPaymentMethodList,
//     expressBuyFilterMaxPremium,
//     expressBuyOffersSorter,
//   ] = useOfferPreferences((state) => [
//     state.expressBuyFilterByCurrencyList,
//     state.expressBuyFilterByPaymentMethodList,
//     state.expressBuyFilterMaxPremium,
//     state.expressBuyOffersSorter,
//   ]);

//   const { sellOffers, isLoading } = useExpressBuySellOffers(
//     expressBuyFilterByAmountRange[0],
//     expressBuyFilterByAmountRange[1],
//     expressBuyFilterByCurrencyList,
//     expressBuyFilterByPaymentMethodList.map((obj) => obj.id),
//     expressBuyFilterMaxPremium,
//     expressBuyOffersSorter,
//   );
//   const navigation = useStackNavigation();

//   const setPopup = useSetPopup();

//   const showSortAndFilterPopup = () => setPopup(<ExpressBuySorters />);

//   const expressBuyHeaderIcons = [
//     { ...headerIcons.expressFlowSorter, onPress: showSortAndFilterPopup },
//     {
//       ...headerIcons["filter"],
//       onPress: () => {
//         navigation.navigate("expressBuyFilters");
//       },
//     },
//   ];

//   return (
//     <Screen header={<Header title={title} icons={expressBuyHeaderIcons} />}>
//       <PeachScrollView contentContainerStyle={tw`grow`} contentStyle={tw`grow`}>
//         <PeachText>All Sell Offers 0.69</PeachText>
//         <>
//           {!isLoading &&
//             sellOffers !== undefined &&
//             sellOffers.map((item, index) => {
//               return (
//                 <>
//                   <PeachText>-------</PeachText>
//                   <PeachText>ID: {item.id}</PeachText>
//                   <PeachText>User: {item.user.id}</PeachText>
//                   <PeachText>Amount: {item.amount}</PeachText>
//                   <PeachText>Premium: {item.premium}</PeachText>
//                   <PeachText>
//                     MeansOfPayment: {JSON.stringify(item.meansOfPayment)}
//                   </PeachText>
//                   <View style={tw`flex-row gap-10px`}>
//                     <Button
//                       style={[tw`bg-error-main`]}
//                       onPress={() => {
//                         navigation.navigate("expressBuyTradeRequest", {
//                           offerId: String(item.id),
//                         });
//                       }}
//                     >
//                       go to page
//                     </Button>
//                   </View>
//                   <PeachText>-------</PeachText>
//                 </>
//               );
//             })}
//         </>
//       </PeachScrollView>
//     </Screen>
//   );
// }

export function ExpressBuyBrowseSellOffers() {
  const expressBuyFilterByAmountRange = useOfferPreferences(
    (state) => state.expressBuyFilterByAmountRange,
  );

  const [
    expressBuyFilterByCurrencyList,
    expressBuyFilterByPaymentMethodList,
    expressBuyFilterMaxPremium,
    expressBuyOffersSorter,
  ] = useOfferPreferences((state) => [
    state.expressBuyFilterByCurrencyList,
    state.expressBuyFilterByPaymentMethodList,
    state.expressBuyFilterMaxPremium,
    state.expressBuyOffersSorter,
  ]);

  const { sellOffers, isLoading, isFetching, refetch } =
    useExpressBuySellOffers(
      expressBuyFilterByAmountRange[0],
      expressBuyFilterByAmountRange[1],
      expressBuyFilterByCurrencyList,
      expressBuyFilterByPaymentMethodList.map((obj) => obj.id),
      expressBuyFilterMaxPremium,
      expressBuyOffersSorter,
    );

  if (isLoading || sellOffers === undefined) return <LoadingScreen />;
  return (
    <Screen header={<ExploreHeader />}>
      {sellOffers.length > 0 ? (
        <FlatList
          data={sellOffers}
          onRefresh={() => refetch()}
          refreshing={isFetching}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OfferCard offer={item} />}
          contentContainerStyle={tw`gap-10px`}
        />
      ) : (
        <View style={tw`items-center justify-center flex-1 gap-4`}>
          <PeachText style={tw`text-center subtitle-2`}>
            {i18n("express.buy.noOffers")}
          </PeachText>
        </View>
      )}
    </Screen>
  );
}

function OfferCard({
  offer,
}: {
  offer: SellOffer & { allowedToInstantTrade: boolean };
}) {
  // const { data: priceBook } = useMarketPrices();
  // const premium =
  //   matched && matchedPrice && selectedCurrency
  //     ? getPremiumOfMatchedOffer(
  //         { amount, price: matchedPrice, currency: selectedCurrency },
  //         priceBook,
  //       )
  //     : match.premium;

  const { allowedToInstantTrade, user, amount, premium } = offer;
  const { fiatPrice, displayCurrency } = useBitcoinPrices(offer.amount);
  // const { offerId } = useRoute<"explore">().params;
  const navigation = useStackNavigation();
  const onPress = () => {
    navigation.navigate("expressBuyTradeRequest", {
      offerId: String(offer.id),
    });
  };

  const isNewUser = user.openedTrades < NEW_USER_TRADE_THRESHOLD;
  const { isDarkMode } = useThemeStore();

  return (
    <TouchableOpacity
      style={[
        tw`justify-center overflow-hidden rounded-2xl`,
        isDarkMode
          ? tw`bg-card`
          : tw`border bg-primary-background-light-color border-primary-main`,
        // matched && tw`border-2 border-success-main`,
      ]}
      onPress={onPress}
    >
      {allowedToInstantTrade && (
        <View style={tw`overflow-hidden rounded-md`}>
          <PeachyBackground />
          <PeachText
            style={tw`text-center py-2px subtitle-2 text-primary-background-light-color`}
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
          {!isNewUser && <Badges id={user.id} unlockedBadges={user.medals} />}
          <PeachText style={tw`text-center`}>
            <PriceFormat
              style={tw`tooltip`}
              currency={displayCurrency}
              amount={fiatPrice * (1 + premium / CENT)}
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

function ExploreHeader() {
  const setPopup = useSetPopup();
  const navigation = useStackNavigation();

  const showSortAndFilterPopup = () => setPopup(<ExpressBuySorters />);

  const expressBuyHeaderIcons = [
    { ...headerIcons.expressFlowSorter, onPress: showSortAndFilterPopup },
    {
      ...headerIcons["filter"],
      onPress: () => {
        navigation.navigate("expressBuyFilters");
      },
    },
  ];

  return <BuyBitcoinHeader icons={expressBuyHeaderIcons} />;
}
