import { FlatList, TouchableOpacity, View } from "react-native";
import { BuyOffer69 } from "../../../peach-api/src/@types/offer";
import { BTCAmount } from "../../components/bitcoin/BTCAmount";
import { horizontalBadgePadding } from "../../components/InfoContainer";
import { Badges } from "../../components/matches/components/Badges";
import { PeachyBackground } from "../../components/PeachyBackground";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { Screen } from "../../components/Screen";
import { PeachText } from "../../components/text/PeachText";
import { PriceFormat } from "../../components/text/PriceFormat";
import { CENT, NEW_USER_TRADE_THRESHOLD } from "../../constants";
import { useExpressSellBuyOffers } from "../../hooks/query/peach069/useExpressSellBuyOffers";
import { useBitcoinPrices } from "../../hooks/useBitcoinPrices";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { ExpressSellSorters } from "../../popups/sorting/ExpressSellSorters";
import { useOfferPreferences } from "../../store/offerPreferenes";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { LoadingScreen } from "../loading/LoadingScreen";
import { SellBitcoinHeader } from "../offerPreferences/components/SellBitcoinHeader";
import { Rating } from "../settings/profile/profileOverview/Rating";

// export function ExpressSellBrowseBuyOffersOLD() {
//   const setPopup = useSetPopup();
//   const title = "Exp Sell: Browse Buy Offers";
//   const expressSellFilterByAmountRange = useOfferPreferences(
//     (state) => state.expressSellFilterByAmountRange,
//   );

//   const [
//     expressSellFilterByCurrencyList,
//     expressSellFilterByPaymentMethodList,
//     expressSellFilterMinPremium,
//     expressSellOffersSorter,
//   ] = useOfferPreferences((state) => [
//     state.expressSellFilterByCurrencyList,
//     state.expressSellFilterByPaymentMethodList,
//     state.expressSellFilterMinPremium,
//     state.expressSellOffersSorter,
//   ]);

//   const { buyOffers, isLoading } = useExpressSellBuyOffers(
//     expressSellFilterByAmountRange[0],
//     expressSellFilterByAmountRange[1],
//     expressSellFilterByCurrencyList,
//     expressSellFilterByPaymentMethodList.map((obj) => obj.id),
//     expressSellFilterMinPremium,
//     expressSellOffersSorter,
//   );
//   const navigation = useStackNavigation();

//   const showSortAndFilterPopup = () => setPopup(<ExpressSellSorters />);

//   const expressSellHeaderIcons = [
//     { ...headerIcons.expressFlowSorter, onPress: showSortAndFilterPopup },
//     {
//       ...headerIcons["filter"],
//       onPress: () => {
//         navigation.navigate("expressSellFilters");
//       },
//     },
//   ];

//   return (
//     <Screen header={<Header title={title} icons={expressSellHeaderIcons} />}>
//       <PeachScrollView contentContainerStyle={tw`grow`} contentStyle={tw`grow`}>
//         <PeachText>All Buy Offers 0.69</PeachText>
//         <>
//           {!isLoading &&
//             buyOffers !== undefined &&
//             buyOffers.map((item, index) => {
//               return (
//                 <React.Fragment key={index}>
//                   <PeachText>-------</PeachText>
//                   <PeachText>ID: {item.id}</PeachText>
//                   <PeachText>User: {item.userId}</PeachText>
//                   <PeachText>Amount: {item.amountSats}</PeachText>
//                   <PeachText>Premium: {item.premium}</PeachText>
//                   <PeachText>
//                     MeansOfPayment: {JSON.stringify(item.meansOfPayment)}
//                   </PeachText>
//                   <View style={tw`flex-row gap-10px`}>
//                     <Button
//                       style={[tw`bg-error-main`]}
//                       onPress={() => {
//                         navigation.navigate("expressSellTradeRequest", {
//                           offerId: String(item.id),
//                         });
//                       }}
//                     >
//                       go to page
//                     </Button>
//                   </View>
//                   <PeachText>-------</PeachText>
//                 </React.Fragment>
//               );
//             })}
//         </>
//       </PeachScrollView>
//     </Screen>
//   );
// }

/////

export function ExpressSellBrowseBuyOffers() {
  const expressSellFilterByAmountRange = useOfferPreferences(
    (state) => state.expressSellFilterByAmountRange,
  );

  const [
    expressSellFilterByCurrencyList,
    expressSellFilterByPaymentMethodList,
    expressSellFilterMinPremium,
    expressSellOffersSorter,
  ] = useOfferPreferences((state) => [
    state.expressSellFilterByCurrencyList,
    state.expressSellFilterByPaymentMethodList,
    state.expressSellFilterMinPremium,
    state.expressSellOffersSorter,
  ]);

  const { buyOffers, isLoading, isFetching, refetch } = useExpressSellBuyOffers(
    expressSellFilterByAmountRange[0],
    expressSellFilterByAmountRange[1],
    expressSellFilterByCurrencyList,
    expressSellFilterByPaymentMethodList.map((obj) => obj.id),
    expressSellFilterMinPremium,
    expressSellOffersSorter,
  );

  if (isLoading || buyOffers === undefined) return <LoadingScreen />;
  return (
    <Screen header={<ExploreHeader />}>
      {buyOffers.length > 0 ? (
        <FlatList
          data={buyOffers}
          onRefresh={() => refetch()}
          refreshing={isFetching}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <OfferCard offer={item} />}
          contentContainerStyle={tw`gap-10px`}
        />
      ) : (
        <View style={tw`items-center justify-center flex-1 gap-4`}>
          <PeachText style={tw`text-center subtitle-2`}>
            {i18n("express.sell.noOffers")}
          </PeachText>
        </View>
      )}
    </Screen>
  );
}

function OfferCard({ offer }: { offer: BuyOffer69 & { user: User } }) {
  // const { data: priceBook } = useMarketPrices();
  // const premium =
  //   matched && matchedPrice && selectedCurrency
  //     ? getPremiumOfMatchedOffer(
  //         { amount, price: matchedPrice, currency: selectedCurrency },
  //         priceBook,
  //       )
  //     : match.premium;

  const { instantTradeCriteria, user, amountSats, premium } = offer;
  const { fiatPrice, displayCurrency } = useBitcoinPrices(offer.amountSats);
  // const { offerId } = useRoute<"explore">().params;
  const navigation = useStackNavigation();
  const onPress = () => {
    navigation.navigate("expressSellTradeRequest", {
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
      {instantTradeCriteria !== undefined && (
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
          <BTCAmount amount={amountSats} size="small" />
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

  const showSortAndFilterPopup = () => setPopup(<ExpressSellSorters />);

  const expressSellHeaderIcons = [
    { ...headerIcons.expressFlowSorter, onPress: showSortAndFilterPopup },
    {
      ...headerIcons["filter"],
      onPress: () => {
        navigation.navigate("expressSellFilters");
      },
    },
  ];

  return <SellBitcoinHeader icons={expressSellHeaderIcons} />;
}
