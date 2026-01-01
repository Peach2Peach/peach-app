import { FlatList, TouchableOpacity, View } from "react-native";
import { Screen } from "../../components/Screen";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { BuyOffer69 } from "../../../peach-api/src/@types/offer";
import { BTCAmount } from "../../components/bitcoin/BTCAmount";
import { Header } from "../../components/Header";
import { PeachID } from "../../components/PeachID";
import { statusCardStyles } from "../../components/statusCard/statusCardStyles";
import { PeachText } from "../../components/text/PeachText";
import { PriceFormat } from "../../components/text/PriceFormat";
import { CENT, fullScreenTabNavigationScreenOptions } from "../../constants";
import { useBitcoinPrices } from "../../hooks/useBitcoinPrices";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import { getBestCurrency } from "../../utils/currency/countOffersByCurrency";
import i18n from "../../utils/i18n";
import { LoadingScreen } from "../loading/LoadingScreen";
import { useUser } from "../publicProfile/useUser";
import { useUserOffers } from "./useUserOffers";

const OffersOfUserTab = createMaterialTopTabNavigator();
const tabs = ["buyOffers", "sellOffers"] as const;

export const OffersOfUser = () => {
  const { userId } = useRoute<"offersOfUser">().params;
  const { user, isLoading } = useUser(userId);
  const { offers, refetch } = useUserOffers(userId);

  useFocusEffect(
    useCallback(() => {
      refetch();

      return () => {};
    }, []),
  );

  if (isLoading || !offers || !user) return <></>;

  return (
    <Screen
      header={
        <Header
          title={i18n("profile.offersofuser.title")}
          icons={[<PeachID id={userId} copyable={false} />]}
        />
      }
    >
      <OffersOfUserTab.Navigator
        screenOptions={{
          ...fullScreenTabNavigationScreenOptions,
          sceneStyle: tw`px-sm md:px-md`,
        }}
      >
        {tabs.map((tab) => (
          <OffersOfUserTab.Screen
            key={tab}
            name={tab}
            options={{
              title: `${i18n("offer." + tab)}`,
              lazy: true,
              lazyPlaceholder: () => <LoadingScreen />,
            }}
            children={() => (
              <View style={tw`grow`} onStartShouldSetResponder={() => true}>
                {offers[tab].length > 0 ? (
                  <FlatList
                    contentContainerStyle={[
                      tw`bg-transparent py-7`,
                      isLoading && tw`opacity-60`,
                    ]}
                    onRefresh={refetch}
                    refreshing={false}
                    showsVerticalScrollIndicator={false}
                    data={offers[tab]}
                    renderItem={({ item }) => <TradeItem item={item} />}
                    ItemSeparatorComponent={() => (
                      <View style={{ height: 12 }} />
                    )}
                  />
                ) : (
                  <OfferPlaceholder />
                )}
              </View>
            )}
          />
        ))}
      </OffersOfUserTab.Navigator>
    </Screen>
  );
};

const TradeItem = ({
  item,
}: {
  item: (BuyOffer69 | SellOffer) & { hasPerformedTradeRequest: boolean };
}) => {
  const navigation = useStackNavigation();
  const { isDarkMode } = useThemeStore();
  const color = item.hasPerformedTradeRequest ? "success" : "primary";
  const amount: number = item.amount ? item.amount : item.amountSats;
  const bestCurrency = getBestCurrency({}, item, []);

  const { fiatPrice, displayCurrency } = useBitcoinPrices(amount, bestCurrency);
  return (
    <TouchableOpacity
      style={[
        tw`overflow-hidden border rounded-xl`,
        isDarkMode ? tw`bg-card` : tw`bg-primary-background-light-color`,
        tw.style(statusCardStyles.border[color]),
      ]}
      onPress={() => {
        if (item.amountSats) {
          navigation.navigate("expressSellTradeRequest", {
            offerId: String(item.id),
          });
        } else {
          navigation.navigate("expressBuyTradeRequest", {
            offerId: String(item.id),
          });
        }
      }}
    >
      <View style={tw`flex-row items-center justify-between px-4 py-3`}>
        <BTCAmount amount={amount} size={"medium"} />
        <PeachText style={tw`text-center mt-1`}>
          <PriceFormat
            // style={tw`tooltip`}
            currency={displayCurrency}
            amount={fiatPrice * (1 + item.premium / CENT)}
          />
          <PeachText
            style={tw.style(
              isDarkMode ? "text-primary-mild-2" : "text-black-65",
            )}
          >
            {" "}
            ({item.premium >= 0 ? "+" : ""}
            {item.premium}%)
          </PeachText>
        </PeachText>
      </View>
    </TouchableOpacity>
  );
};

const OfferPlaceholder = () => (
  <View style={tw`items-center justify-center flex-1`}>
    <PeachText style={tw`h6 text-black-50`}>
      {i18n("profile.offersofuser.empty")}
    </PeachText>
  </View>
);
