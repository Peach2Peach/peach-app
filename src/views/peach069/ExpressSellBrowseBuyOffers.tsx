import { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { BuyOffer69 } from "../../../peach-api/src/@types/offer";
import { ExpressSellAdvancedFilters } from "../../components/ExpressSellAdvancedFilters";
import { ExpressSellCurrenciesDrawer } from "../../components/ExpressSellCurrenciesDrawer";
import { ExpressSellPaymentMethodsDrawer } from "../../components/ExpressSellPaymentMethodsDrawer";
import { horizontalBadgePadding } from "../../components/InfoContainer";
import { PeachyBackground } from "../../components/PeachyBackground";
import { Screen } from "../../components/Screen";
import { BTCAmount } from "../../components/bitcoin/BTCAmount";
import { NewBubble as Bubble } from "../../components/bubble/Bubble";
import { Badges } from "../../components/matches/components/Badges";
import { PeachText } from "../../components/text/PeachText";
import { PriceFormat } from "../../components/text/PriceFormat";
import { CENT, NEW_USER_TRADE_THRESHOLD } from "../../constants";
import { useExpressSellBuyOffers } from "../../hooks/query/peach069/useExpressSellBuyOffers";
import { useBitcoinPrices } from "../../hooks/useBitcoinPrices";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { LoadingScreen } from "../loading/LoadingScreen";
import { SellBitcoinHeader } from "../offerPreferences/components/SellBitcoinHeader";
import { Rating } from "../settings/profile/profileOverview/Rating";

export function ExpressSellBrowseBuyOffers() {
  const { buyOffers, isLoading, isFetching, refetch } =
    useExpressSellBuyOffers();
  return (
    <Screen header={<ExploreHeader />}>
      <View style={tw`flex-row self-stretch justify-between gap-13px`}>
        <PaymentMethodsBubble />
        <CurrenciesBubble />
      </View>
      <BuyOfferList
        buyOffers={buyOffers}
        isLoading={isLoading}
        isFetching={isFetching}
        refetch={refetch}
      />
    </Screen>
  );
}

function PaymentMethodsBubble() {
  const [isPaymentMethodDrawerOpen, setIsPaymentMethodDrawerOpen] =
    useState(false);

  return (
    <>
      <Bubble
        color="gray"
        iconId="chevronDown"
        ghost
        style={tw`self-stretch`}
        onPress={() => setIsPaymentMethodDrawerOpen(true)}
      >
        {i18n("paymentMethods.title")}
      </Bubble>
      <ExpressSellPaymentMethodsDrawer
        isOpen={isPaymentMethodDrawerOpen}
        onClose={() => setIsPaymentMethodDrawerOpen(false)}
      />
    </>
  );
}

function CurrenciesBubble() {
  const [isCurrencyDrawerOpen, setIsCurrencyDrawerOpen] = useState(false);
  return (
    <>
      <Bubble
        color="gray"
        iconId="chevronDown"
        ghost
        style={tw`self-stretch`}
        onPress={() => setIsCurrencyDrawerOpen(true)}
      >
        {i18n("currencies")}
      </Bubble>
      <ExpressSellCurrenciesDrawer
        isOpen={isCurrencyDrawerOpen}
        onClose={() => setIsCurrencyDrawerOpen(false)}
      />
    </>
  );
}

function BuyOfferList({
  buyOffers,
  isLoading,
  isFetching,
  refetch,
}: {
  buyOffers?: (BuyOffer69 & {
    tradeStatusNew?: TradeStatus;
    user: User;
    allowedToInstantTrade: boolean;
    hasPerformedTradeRequest: boolean;
  })[];
  isLoading: boolean;
  isFetching: boolean;
  refetch: Function;
}) {
  if (isLoading || buyOffers === undefined) return <LoadingScreen />;
  return (
    <>
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
    </>
  );
}

function OfferCard({
  offer,
}: {
  offer: BuyOffer69 & {
    user: User;
    allowedToInstantTrade: boolean;
    hasPerformedTradeRequest: boolean;
  };
}) {
  const {
    allowedToInstantTrade,
    hasPerformedTradeRequest,
    user,
    amountSats,
    premium,
  } = offer;

  const { fiatPrice, displayCurrency } = useBitcoinPrices(offer.amountSats);
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
        hasPerformedTradeRequest && tw`border-2 border-success-main`,
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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  return (
    <>
      <SellBitcoinHeader
        icons={[
          {
            id: "filter",
            color: tw.color("black-50"),
            onPress: () => setShowAdvancedFilters(true),
          },
        ]}
      />
      <ExpressSellAdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
      />
    </>
  );
}
