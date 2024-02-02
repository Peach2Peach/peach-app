import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";
import Share from "react-native-share";
import { LogoIcons } from "../../assets/logo";
import { Header } from "../../components/Header";
import { PeachyGradient } from "../../components/PeachyGradient";
import { Screen } from "../../components/Screen";
import { TouchableIcon } from "../../components/TouchableIcon";
import { Button } from "../../components/buttons/Button";
import { PeachText } from "../../components/text/PeachText";
import { ProgressDonut } from "../../components/ui/ProgressDonut";
import { MSINAMINUTE } from "../../constants";
import { marketKeys } from "../../hooks/query/useMarketPrices";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useNavigation } from "../../hooks/useNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { info } from "../../utils/log/info";
import { peachAPI } from "../../utils/peachAPI";
import { openURL } from "../../utils/web/openURL";
import { systemKeys } from "../addPaymentMethod/useFormFields";

export function Home() {
  return (
    <Screen showTradingLimit header={<Header showPriceStats />}>
      <View style={tw`items-center flex-1 gap-10px`}>
        <LogoIcons.homeLogo height={76} width={173} />
        <View style={tw`self-stretch flex-1 gap-10px`}>
          <DailyMessage />
          <MarketStats />
          <FreeTradesDonut />
        </View>
      </View>
      <View style={tw`flex-row gap-10px`}>
        <BuyButton />
        <SellButton />
      </View>
    </Screen>
  );
}

function FreeTradesDonut() {
  const { user } = useSelfUser();
  const freeTrades = user?.freeTrades || 0;
  const maxFreeTrades = user?.maxFreeTrades || 0;
  if (freeTrades === 0) return null;
  return (
    <ProgressDonut
      style={tw`py-2`}
      title={i18n("settings.referrals.noPeachFees.freeTrades")}
      value={freeTrades}
      max={maxFreeTrades}
    />
  );
}

function DailyMessage() {
  const { data: message } = useQuery({
    queryKey: systemKeys.news,
    queryFn: async () => {
      const { result, error } = await peachAPI.public.system.getNews();
      if (error || !result?.[0]) throw error || new Error("No message found");
      return result?.[0];
    },
  });
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
    <View style={tw`overflow-hidden rounded-2xl`}>
      <PeachyGradient style={tw`absolute w-full h-full`} />
      <View
        style={tw`flex-row items-center self-stretch justify-center p-4 gap-10px`}
      >
        <PeachText
          onPress={onTextPress}
          style={tw`flex-1 text-center subtitle-1 text-primary-background-light`}
        >
          {message.text}
        </PeachText>
        <TouchableIcon
          onPress={onSharePress}
          id="share"
          iconColor={tw.color("primary-background-light")}
        />
      </View>
    </View>
  );
}

function MarketStats() {
  const { data } = useQuery({
    queryKey: marketKeys.offerStats(),
    queryFn: async () => {
      const { result, error } = await peachAPI.public.market.getOffersStats();
      if (error) throw error;
      return result;
    },
    placeholderData: {
      buy: {
        open: 0,
      },
      sell: {
        open: 0,
        avgPremium: 0,
      },
    },
    refetchInterval: MSINAMINUTE,
  });
  return (
    <View style={tw`items-center justify-center gap-5 pb-4 grow`}>
      <PeachText style={tw`subtitle-0 text-success-main`}>
        {i18n("home.openBuyOffers", String(data?.buy.open))}
      </PeachText>
      <View style={tw`items-center -gap-2`}>
        <PeachText style={tw`subtitle-0 text-primary-main`}>
          {i18n("home.openSellOffers", String(data?.sell.open))}
        </PeachText>
        <PeachText style={tw`subtitle-1 text-primary-main`}>
          {i18n("home.averagePremium", String(data?.sell.avgPremium))}
        </PeachText>
      </View>
    </View>
  );
}

const buttonStyle = tw`flex-1 px-5 py-3`;

function BuyButton() {
  const navigation = useNavigation();
  const goToBuyOfferPreferences = () =>
    navigation.navigate("buyOfferPreferences");
  return (
    <Button
      style={[buttonStyle, tw`bg-success-main`]}
      onPress={goToBuyOfferPreferences}
    >
      {i18n("buy")}
    </Button>
  );
}

function SellButton() {
  const navigation = useNavigation();
  const goToSellOfferPreferences = () =>
    navigation.navigate("sellOfferPreferences");
  return (
    <Button style={[buttonStyle]} onPress={goToSellOfferPreferences}>
      {i18n("sell")}
    </Button>
  );
}
