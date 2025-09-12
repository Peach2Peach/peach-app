import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import Share from "react-native-share";
import { LogoIcons } from "../../assets/logo";
import { CurrencyDrawer } from "../../components/CurrencyDrawer";
import { DiamondGradientBackground } from "../../components/DiamondGradientBackground";
import { Icon } from "../../components/Icon";
import { RadialGradientBorder } from "../../components/RadialGradientBorder";
import { Screen } from "../../components/Screen";
import { TouchableIcon } from "../../components/TouchableIcon";
import { Button } from "../../components/buttons/Button";
import { PeachText } from "../../components/text/PeachText";
import { HorizontalLine } from "../../components/ui/HorizontalLine";
import { MSINAMINUTE } from "../../constants";
import { marketKeys } from "../../hooks/query/useMarketPrices";
import { useBitcoinPrices } from "../../hooks/useBitcoinPrices";
import { useIsMediumScreen } from "../../hooks/useIsMediumScreen";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { info } from "../../utils/log/info";
import { peachAPI } from "../../utils/peachAPI";
import { groupChars } from "../../utils/string/groupChars";
import { priceFormat } from "../../utils/string/priceFormat";
import { thousands } from "../../utils/string/thousands";
import { openURL } from "../../utils/web/openURL";
import { systemKeys } from "../addPaymentMethod/usePaymentMethodInfo";

export function Home() {
  const navigation = useStackNavigation();
  const goToProfile = () => navigation.navigate("myProfile");
  const isMediumScreen = useIsMediumScreen();
  const { isDarkMode } = useThemeStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <Screen
        showTradingLimit
        style={
          isDarkMode
            ? tw`bg-backgroundMain-dark`
            : tw`bg-primary-background-dark-color`
        }
        actions={
          <View
            style={tw`flex-row gap-10px px-sm md:px-md border-t-[px] py-sm md:py-md border-primary-mild-1`}
          >
            <ExpressBuyButton />
            <ExpressSellButton />
          </View>
        }
      >
        <View style={tw`items-center flex-1 gap-2 md:gap-4`}>
          <View style={tw`self-stretch gap-2`}>
            <View style={tw`flex-row items-center justify-between w-full px-2`}>
              {isMediumScreen ? (
                <LogoIcons.homeLogo />
              ) : (
                <LogoIcons.homeLogoSmall />
              )}
              <TouchableIcon
                id="user"
                onPress={goToProfile}
                iconSize={20}
                style={tw`items-center justify-center py-px px-10px md:py-2`}
              />
            </View>
            <BTCPriceInfo onPress={() => setIsDrawerOpen(!isDrawerOpen)} />
          </View>
          <View style={tw`self-stretch gap-2 md:gap-4`}>
            <News />
            <MarketStats />
          </View>
        </View>
      </Screen>

      <CurrencyDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
const GROUP_SIZE = 3;
function BTCPriceInfo({ onPress }: { onPress: () => void }) {
  const { bitcoinPrice, moscowTime, displayCurrency } = useBitcoinPrices();
  const { isDarkMode } = useThemeStore();
  if (!bitcoinPrice) return null;

  return (
    <DiamondGradientBackground
      style={tw`self-stretch rounded-2xl`}
      centerColor={isDarkMode ? "#DD8B75" : "#FFBD71"}
      middleColor={isDarkMode ? "#C1705C" : "#FF9472"}
      edgeColor={isDarkMode ? "#8F4A35" : "#FFA59F"}
    >
      <View style={tw`flex-row items-center justify-between p-2 md:p-4`}>
        <View>
          <View style={tw`flex-row gap-5px`}>
            <LogoIcons.newBitcoinLogo />
            <PeachText
              style={tw`leading-normal subtitle-0`}
            >{`1 ${i18n("btc")}`}</PeachText>
          </View>
          <PeachText style={tw`h5 text-primary-background-light-color`}>
            {displayCurrency === "SAT"
              ? groupChars(bitcoinPrice.toFixed(), GROUP_SIZE)
              : priceFormat(bitcoinPrice, true)}
            {` ${displayCurrency}`}
          </PeachText>
        </View>
        <View style={tw`items-end`}>
          <TouchableOpacity
            style={tw`flex-row items-center justify-center gap-2`}
            onPress={onPress}
          >
            <PeachText style={tw`leading-normal subtitle-0`}>
              {`1 ${displayCurrency}`}
            </PeachText>
            <Icon
              size={16}
              color={tw.color(
                isDarkMode ? "backgroundLight-light" : "black-100",
              )}
              id="chevronDown"
            />
          </TouchableOpacity>

          <PeachText style={tw`h5 text-primary-background-dark-color`}>
            {i18n("currency.format.sats", thousands(moscowTime))}
          </PeachText>
        </View>
      </View>
    </DiamondGradientBackground>
  );
}

const NUMBER_OF_MINUTES = 5;
function useNews() {
  return useQuery({
    queryKey: systemKeys.news(),
    queryFn: async () => {
      const { result, error } = await peachAPI.public.system.getNews();
      if (error || !result?.[0]) throw error || new Error("No message found");
      return result?.[0];
    },
    refetchInterval: MSINAMINUTE * NUMBER_OF_MINUTES,
  });
}

function News() {
  const { data: message } = useNews();
  const { isDarkMode } = useThemeStore();
  if (!message) return null;

  const onSharePress = () => {
    Share.open({
      message: message.shareText || message.text,
      url: message.url,
    }).catch((e) => {
      info("User did not share", e);
    });
  };

  const onTextPress = () => {
    openURL(message.url);
  };

  return (
    <RadialGradientBorder
      style={tw`self-stretch rounded-2xl`}
      centerColor={isDarkMode ? "#DD8B75" : "#FFB76F"}
      middleColor={isDarkMode ? "#C1705C" : "#FFAB90"}
      edgeColor={isDarkMode ? "#8F4A35" : "#FF837B"}
    >
      <View
        style={[
          tw`self-stretch justify-center p-2 gap-10px bg-primary-background-light-color rounded-2xl md:p-4`,
          isDarkMode && tw`bg-[#3F221C]`,
        ]}
      >
        <View style={tw`flex-row items-center self-stretch justify-between`}>
          <View style={tw`rounded-md bg-primary-main px-5px`}>
            <PeachText
              style={tw`uppercase text-primary-background-light-color subtitle-1`}
            >
              {i18n("home.news")}
            </PeachText>
          </View>
          <TouchableIcon
            onPress={onSharePress}
            id="externalLink"
            iconColor={tw.color("primary-main")}
            iconSize={20}
            style={tw`pr-12.5px`}
          />
        </View>
        <PeachText
          onPress={onTextPress}
          disabled={!message.url}
          style={tw`body-s`}
          numberOfLines={3}
        >
          {message.text}
        </PeachText>
      </View>
    </RadialGradientBorder>
  );
}

function useOfferStats() {
  return useQuery({
    queryKey: marketKeys.offerStats(),
    queryFn: async () => {
      const { result, error } = await peachAPI.public.market.getOffersStats();
      if (error) throw error;
      return result;
    },
    placeholderData: {
      buy: {
        open: 0,
        avgPremium: 0,
      },
      sell: {
        open: 0,
        avgPremium: 0,
      },
      totalAvgPremium: 0,
    },
    refetchInterval: MSINAMINUTE,
  });
}

function MarketStats() {
  const { data } = useOfferStats();
  const { isDarkMode } = useThemeStore();
  return (
    <RadialGradientBorder
      style={tw`self-stretch rounded-2xl`}
      centerColor={isDarkMode ? "#DD8B75" : "#FFB76F"}
      middleColor={isDarkMode ? "#C1705C" : "#FFAB90"}
      edgeColor={isDarkMode ? "#8F4A35" : "#FF837B"}
    >
      <View
        style={[
          tw`self-stretch justify-center gap-2 p-2 md:gap-4 bg-primary-background-light-color rounded-2xl md:p-4`,
          isDarkMode && tw`bg-[#3F221C]`,
        ]}
      >
        <View style={tw`flex-row items-center self-stretch justify-between`}>
          <View style={tw`rounded-md bg-primary-main px-5px`}>
            <PeachText
              style={tw`uppercase text-primary-background-light-color subtitle-1`}
            >
              {i18n("offer.openOffers")}
            </PeachText>
          </View>
          {/* <View style={tw`flex-row items-center gap-6px`}>
            <PeachText style={tw`uppercase notification`}>
              {i18n("offer.averagePremium")}
            </PeachText>
            <View style={tw`rounded-md bg-success-mild-2 px-5px`}>
              <PeachText
                style={tw`text-success-dark-2 font-baloo-semibold text-3xs`}
              >
                {data?.totalAvgPremium !== undefined &&
                data?.totalAvgPremium >= 0
                  ? "+"
                  : ""}
                {data?.totalAvgPremium}%
              </PeachText>
            </View>
          </View> */}
        </View>
        <View style={tw`gap-1 md:gap-2`}>
          <View style={tw`flex-row items-center py-2 gap-14px`}>
            <OfferCounter
              numberOfOffers={data?.buy.open}
              averagePremium={data?.buy.avgPremium}
              type="buy"
            />
            <View style={tw`w-px h-full bg-black-10`} />
            <OfferCounter
              numberOfOffers={data?.sell.open}
              averagePremium={data?.sell.avgPremium}
              type="sell"
            />
          </View>
          <HorizontalLine />
          <View style={tw`flex-row pt-2 gap-10px`}>
            <BuyButton />
            <SellButton />
          </View>
        </View>
      </View>
    </RadialGradientBorder>
  );
}

const buttonStyle = tw`flex-1 px-1 py-1 md:py-2`;

function ExpressSellButton() {
  const navigation = useStackNavigation();
  const goToExpressSell = () =>
    navigation.navigate("expressSellBrowseBuyOffers");
  return (
    <Button style={[buttonStyle]} onPress={goToExpressSell}>
      {i18n("sell")}
    </Button>
  );
}
function ExpressBuyButton() {
  const navigation = useStackNavigation();
  const goToExpressBuy = () =>
    navigation.navigate("expressBuyBrowseSellOffers");
  return (
    <Button style={[buttonStyle, tw`bg-success-main`]} onPress={goToExpressBuy}>
      {i18n("buy")}
    </Button>
  );
}

function BuyButton() {
  const navigation = useStackNavigation();
  const goToBuyOfferPreferences = () => navigation.navigate("createBuyOffer");
  const { isDarkMode } = useThemeStore();
  return (
    <Button
      style={[
        buttonStyle,
        tw`border`,
        isDarkMode && tw`bg-backgroundMain-dark`,
      ]}
      textColor={tw.color("success-main")}
      onPress={goToBuyOfferPreferences}
      ghost
    >
      {i18n("offer.create.buy")}
    </Button>
  );
}

function SellButton() {
  const navigation = useStackNavigation();
  const goToSellOfferPreferences = () =>
    navigation.navigate("sellOfferPreferences");
  const { isDarkMode } = useThemeStore();
  return (
    <Button
      style={[
        buttonStyle,
        tw`border`,
        isDarkMode && tw`bg-backgroundMain-dark`,
      ]}
      ghost
      textColor={tw.color("primary-main")}
      onPress={goToSellOfferPreferences}
    >
      {i18n("offer.create.sell")}
    </Button>
  );
}

function OfferCounter({
  numberOfOffers,
  averagePremium,
  type,
}: {
  numberOfOffers?: number;
  averagePremium?: number;
  type: "buy" | "sell";
}) {
  const { isDarkMode } = useThemeStore();
  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-row items-center gap-6px`}>
        <View
          style={[
            tw`items-center flex-1 px-2 rounded-1`,
            type === "buy"
              ? isDarkMode
                ? tw`bg-success-mild-2`
                : tw`bg-success-mild-1-color`
              : isDarkMode
                ? tw`bg-primary-mild-1`
                : tw`bg-primary-background-dark-color`,
          ]}
        >
          {numberOfOffers === undefined ? (
            <ActivityIndicator
              size="small"
              color={tw.color(type === "buy" ? "success-main" : "error-main")}
            />
          ) : (
            <PeachText
              style={[
                tw`text-xl font-medium leading-normal tracking-normal font-baloo`,
                isDarkMode && tw`text-black-90`,
              ]}
            >
              {numberOfOffers}
            </PeachText>
          )}
        </View>
        <PeachText style={tw`text-xs font-medium leading-6 font-baloo`}>
          {i18n(type === "buy" ? "offer.buyOffers" : "offer.sellOffers")}
        </PeachText>
      </View>
      <PeachText
        style={[
          tw`font-semibold font-baloo text-3xs text-black-50`,
          isDarkMode && tw`text-black-25`,
        ]}
      >
        {i18n("offer.averagePremium")}{" "}
        <PeachText
          style={tw`font-semibold font-baloo text-3xs ${
            averagePremium !== undefined && averagePremium >= 0
              ? "text-success-main"
              : "text-error-main"
          }`}
        >
          {averagePremium !== undefined
            ? `${averagePremium >= 0 ? "+" : ""}${averagePremium}%`
            : "-"}
        </PeachText>
      </PeachText>
    </View>
  );
}
