import { useCallback, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { JSX } from "react/jsx-runtime";
import { BuyOffer69 } from "../../../peach-api/src/@types/offer";
import { LogoIcons } from "../../assets/logo";
import { ExpressSellAdvancedFilters } from "../../components/ExpressSellAdvancedFilters";
import { ExpressSellCurrenciesDrawer } from "../../components/ExpressSellCurrenciesDrawer";
import { ExpressSellPaymentMethodsDrawer } from "../../components/ExpressSellPaymentMethodsDrawer";
import { Header } from "../../components/Header";
import { horizontalBadgePadding } from "../../components/InfoContainer";
import { PeachyBackground } from "../../components/PeachyBackground";
import { Screen } from "../../components/Screen";
import { TouchableIcon } from "../../components/TouchableIcon";
import { BTCAmount } from "../../components/bitcoin/BTCAmount";
import { NewBubble as Bubble } from "../../components/bubble/Bubble";
import { Badges } from "../../components/matches/components/Badges";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { PeachText } from "../../components/text/PeachText";
import { PriceFormat } from "../../components/text/PriceFormat";
import { CENT, NEW_USER_TRADE_THRESHOLD } from "../../constants";
import { useExpressSellBuyOffers } from "../../hooks/query/peach069/useExpressSellBuyOffers";
import { useBitcoinPrices } from "../../hooks/useBitcoinPrices";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { HelpPopup } from "../../popups/HelpPopup";
import { useOfferPreferences } from "../../store/offerPreferenes";
import { defaultPreferences } from "../../store/offerPreferenes/useOfferPreferences";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";

import {
  countOffersByCurrency,
  CountsByCurrency,
  getBestCurrency,
} from "../../utils/currency/countOffersByCurrency";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { LoadingScreen } from "../loading/LoadingScreen";
import { Rating } from "../settings/profile/profileOverview/Rating";

export function ExpressSellBrowseBuyOffers() {
  const { buyOffers, isLoading, refetch } = useExpressSellBuyOffers();

  return (
    <Screen header={<ExploreHeader />} style={tw`gap-10px`}>
      <View style={tw`flex-row self-stretch justify-between pt-1 gap-13px`}>
        <PaymentMethodsBubble />
        <CurrenciesBubble />
      </View>
      <BuyOfferList
        buyOffers={buyOffers}
        isLoading={isLoading}
        refetch={refetch}
      />
    </Screen>
  );
}

function PaymentMethodsBubble() {
  const [isPaymentMethodDrawerOpen, setIsPaymentMethodDrawerOpen] =
    useState(false);

  const selectedPaymentMethods = useOfferPreferences(
    (state) => state.expressSellFilterByPaymentMethodList,
  );

  return (
    <>
      <View style={tw`relative self-stretch`}>
        <Bubble
          color="gray"
          iconId="chevronDown"
          ghost
          style={tw`self-stretch`}
          onPress={() => setIsPaymentMethodDrawerOpen(true)}
        >
          {i18n("paymentMethods.title")}
        </Bubble>
        {selectedPaymentMethods.length > 0 && (
          <View
            style={tw`absolute items-center justify-center w-5 h-5 border-2 border-white rounded-full -top-2.5 -right-0 bg-info-main`}
          >
            <PeachText
              style={tw`ml-px font-semibold text-white font-baloo text-3xs -mt-3px`}
            >
              {selectedPaymentMethods.length}
            </PeachText>
          </View>
        )}
      </View>
      <ExpressSellPaymentMethodsDrawer
        isOpen={isPaymentMethodDrawerOpen}
        onClose={() => setIsPaymentMethodDrawerOpen(false)}
      />
    </>
  );
}

function CurrenciesBubble() {
  const [isCurrencyDrawerOpen, setIsCurrencyDrawerOpen] = useState(false);

  const selectedCurrencies = useOfferPreferences(
    (state) => state.expressSellFilterByCurrencyList,
  );

  return (
    <>
      <View style={tw`relative self-stretch`}>
        <Bubble
          color="gray"
          iconId="chevronDown"
          ghost
          style={tw`self-stretch`}
          onPress={() => setIsCurrencyDrawerOpen(true)}
        >
          {i18n("currencies")}
        </Bubble>
        {selectedCurrencies.length > 0 && (
          <View
            style={tw`absolute items-center justify-center w-5 h-5 border-2 border-white rounded-full -top-2.5 -right-0 bg-info-main`}
          >
            <PeachText
              style={tw`ml-px font-semibold text-white font-baloo text-3xs -mt-3px`}
            >
              {selectedCurrencies.length}
            </PeachText>
          </View>
        )}
      </View>
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
  refetch,
}: {
  buyOffers?: (BuyOffer69 & {
    tradeStatusNew?: TradeStatus;
    user: User;
    allowedToInstantTrade: boolean;
    hasPerformedTradeRequest: boolean;
  })[];
  isLoading: boolean;
  refetch: Function;
}) {
  if (isLoading || buyOffers === undefined) return <LoadingScreen />;

  const currencyCounted = countOffersByCurrency(buyOffers);

  return (
    <>
      {buyOffers.length > 0 ? (
        <>
          <OfferStats buyOffers={buyOffers} />
          <FlatList
            data={buyOffers}
            onRefresh={() => refetch()}
            refreshing={false}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <OfferCard offer={item} currencyCounted={currencyCounted} />
            )}
            contentContainerStyle={tw`gap-10px`}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
        </>
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

function OfferStats({
  buyOffers,
}: {
  buyOffers: (BuyOffer69 & {
    user: User;
    allowedToInstantTrade: boolean;
    hasPerformedTradeRequest: boolean;
  })[];
}) {
  const { isDarkMode } = useThemeStore();
  const averagePremium = Math.round(
    buyOffers.reduce((acc, offer) => acc + offer.premium, 0) / buyOffers.length,
  );

  return (
    <View style={tw`items-center justify-center -gap-1 py-md`}>
      <PeachText
        style={[tw`h5 text-black-65`, isDarkMode && tw`text-black-25`]}
      >
        {i18n("express.sell.numberOfOffers", String(buyOffers.length))}
      </PeachText>
      <PeachText style={tw`body-s text-black-25`}>
        {i18n("express.averagePremium", String(averagePremium))}
      </PeachText>
    </View>
  );
}

function OfferCard({
  currencyCounted,
  offer,
}: {
  currencyCounted: CountsByCurrency;
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

  const selectedCurrencies = useOfferPreferences(
    (state) => state.expressSellFilterByCurrencyList,
  );
  const bestCurrency = getBestCurrency(
    currencyCounted,
    offer,
    selectedCurrencies,
  );

  const { fiatPrice, displayCurrency } = useBitcoinPrices(
    offer.amountSats,
    bestCurrency,
  );
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
  const setPopup = useSetPopup();
  const showExpressSellHelp = useCallback(
    () => setPopup(<HelpPopup id="expressSellHelp" />),
    [setPopup],
  );
  const { isDarkMode } = useThemeStore();
  const [
    expressSellFilterByAmountRange,
    expressSellFilterByCurrencyList,
    expressSellFilterByPaymentMethodList,
    expressSellFilterMinPremium,
  ] = useOfferPreferences((state) => [
    state.expressSellFilterByAmountRange,
    state.expressSellFilterByCurrencyList,
    state.expressSellFilterByPaymentMethodList,
    state.expressSellFilterMinPremium,
  ]);

  const hasFilters =
    JSON.stringify(expressSellFilterByAmountRange) !==
      JSON.stringify(defaultPreferences.expressSellFilterByAmountRange) ||
    expressSellFilterByCurrencyList.length > 0 ||
    expressSellFilterByPaymentMethodList.length > 0 ||
    expressSellFilterMinPremium !==
      defaultPreferences.expressSellFilterMinPremium;

  return (
    <>
      <Header
        icons={[
          <View style={tw`relative`}>
            <TouchableIcon
              id={"filter"}
              onPress={() => setShowAdvancedFilters(true)}
              iconColor={tw.color("black-50")}
              style={tw`w-5 h-5 md:w-6 md:h-6`}
            />
            {hasFilters && (
              <View
                style={tw`absolute w-3 h-3 border-2 border-white rounded-full -right-1.5 -top-1.4 bg-info-main`}
              />
            )}
          </View>,
          <TouchableIcon
            id={headerIcons.help.id}
            key={`help`}
            onPress={showExpressSellHelp}
            iconColor={headerIcons.help.color}
            style={tw`w-5 h-5 md:w-6 md:h-6`}
          />,
        ]}
        titleComponent={
          <>
            <PeachText style={tw`h7 md:h6 text-primary-main`}>
              {i18n("sell")}
            </PeachText>
            {isDarkMode ? (
              <LogoIcons.bitcoinTextDark
                style={tw`h-14px md:h-16px w-63px md:w-71px`}
              />
            ) : (
              <LogoIcons.bitcoinText
                style={tw`h-14px md:h-16px w-63px md:w-71px`}
              />
            )}
          </>
        }
      />
      <ExpressSellAdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
      />
    </>
  );
}
function setPopup(arg0: JSX.Element): any {
  throw new Error("Function not implemented.");
}
