import { FlatList, TouchableOpacity, View } from "react-native";
import { Match } from "../../../peach-api/src/@types/match";
import { horizontalBadgePadding } from "../../components/InfoContainer";
import { PeachyBackground } from "../../components/PeachyBackground";
import { Screen } from "../../components/Screen";
import { BTCAmount } from "../../components/bitcoin/BTCAmount";
import { Badges } from "../../components/matches/components/Badges";
import { getPremiumOfMatchedOffer } from "../../components/matches/getPremiumOfMatchedOffer";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { PeachText } from "../../components/text/PeachText";
import { PriceFormat } from "../../components/text/PriceFormat";
import { CENT, NEW_USER_TRADE_THRESHOLD } from "../../constants";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useOfferDetail } from "../../hooks/query/useOfferDetail";
import { useBitcoinPrices } from "../../hooks/useBitcoinPrices";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { CancelOfferPopup } from "../../popups/CancelOfferPopup";
import { BuySorters } from "../../popups/sorting/BuySorters";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { isSellOffer } from "../../utils/offer/isSellOffer";
import { LoadingScreen } from "../loading/LoadingScreen";
import { BuyBitcoinHeader } from "../offerPreferences/components/BuyBitcoinHeader";
import { MarketInfo } from "../offerPreferences/components/MarketInfo";
import { useOfferMatches } from "../search/hooks/useOfferMatches";
import { Rating } from "../settings/profile/profileOverview/Rating";

export function Explore() {
  const { offerId } = useRoute<"explore">().params;
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
    <Screen header={<ExploreHeader />}>
      {hasMatches ? (
        <FlatList
          ListHeaderComponent={<BuyOfferMarketInfo />}
          data={matches}
          onRefresh={() => refetch()}
          refreshing={isRefetching}
          keyExtractor={(item) => item.offerId}
          renderItem={({ item }) => <ExploreCard match={item} />}
          onEndReachedThreshold={0.5}
          onEndReached={() => fetchNextPage()}
          contentContainerStyle={tw`gap-10px`}
        />
      ) : (
        <View style={tw`items-center justify-center flex-1 gap-4`}>
          <BuyOfferMarketInfo />
          <PeachText style={tw`text-center subtitle-2`}>
            {i18n("search.weWillNotifyYou")}
          </PeachText>
        </View>
      )}
    </Screen>
  );
}

function BuyOfferMarketInfo() {
  const { offerId } = useRoute<"explore">().params;
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

function ExploreCard({ match }: { match: Match }) {
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
  const { fiatPrice, displayCurrency } = useBitcoinPrices(amount);
  const { offerId } = useRoute<"explore">().params;
  const navigation = useStackNavigation();
  const onPress = () => {
    navigation.navigate("matchDetails", { matchId: match.offerId, offerId });
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
        matched && tw`border-2 border-success-main`,
      ]}
      onPress={onPress}
    >
      {instantTrade && (
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
              currency={match.selectedCurrency ?? displayCurrency}
              amount={match.matchedPrice ?? fiatPrice * (1 + premium / CENT)}
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
  const navigation = useStackNavigation();
  const { offerId } = useRoute<"explore">().params;
  const setPopup = useSetPopup();

  const showSortAndFilterPopup = () => setPopup(<BuySorters />);
  const cancelOffer = () => setPopup(<CancelOfferPopup offerId={offerId} />);
  const goToPreferences = () =>
    navigation.navigate("editBuyPreferences", { offerId });

  return (
    <BuyBitcoinHeader
      icons={[
        { ...headerIcons.buyFilter, onPress: showSortAndFilterPopup },
        { ...headerIcons.buyPreferences, onPress: goToPreferences },
        { ...headerIcons.cancel, onPress: cancelOffer },
      ]}
    />
  );
}
