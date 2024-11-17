import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useEffect, useMemo } from "react";
import { SectionList, SectionListData, View } from "react-native";
import { ContractSummary } from "../../../peach-api/src/@types/contract";
import { OfferSummary } from "../../../peach-api/src/@types/offer";
import { Header } from "../../components/Header";
import { Screen } from "../../components/Screen";
import { NotificationBubble } from "../../components/bubble/NotificationBubble";
import { PeachText } from "../../components/text/PeachText";
import { LinedText } from "../../components/ui/LinedText";
import { fullScreenTabNavigationScreenOptions } from "../../constants";
import { useTradeSummaries } from "../../hooks/query/useTradeSummaries";
import { useShowErrorBanner } from "../../hooks/useShowErrorBanner";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { parseError } from "../../utils/parseError";
import { useHomeScreenRoute } from "../home/useHomeScreenRoute";
import { LoadingScreen } from "../loading/LoadingScreen";
import { TradeItem } from "./components/TradeItem";
import { TradePlaceholders } from "./components/TradePlaceholders";
import { getCategories } from "./utils/getCategories";

const YourTradesTab = createMaterialTopTabNavigator();
const tabs = [
  "yourTrades.buy",
  "yourTrades.sell",
  "yourTrades.history",
] as const;

export const YourTrades = () => {
  const { summaries, isLoading, error, refetch } = useTradeSummaries();
  const { params } = useHomeScreenRoute<"yourTrades">();
  const showErrorBanner = useShowErrorBanner();

  useEffect(() => {
    if (error) showErrorBanner(parseError(error));
  }, [error, showErrorBanner]);

  return (
    <Screen style={tw`px-0`} header={<YourTradesHeader />}>
      <YourTradesTab.Navigator
        initialRouteName={params?.tab || "yourTrades.buy"}
        screenOptions={fullScreenTabNavigationScreenOptions}
        sceneContainerStyle={[tw`px-sm`, tw`md:px-md`]}
      >
        {tabs.map((tab) => (
          <YourTradesTab.Screen
            key={tab}
            name={tab}
            options={{
              title: `${i18n(tab)}`,
              tabBarBadge: () => <TabBarBadge summaries={summaries[tab]} />,
              lazy: true,
              lazyPlaceholder: () => <LoadingScreen />,
            }}
            children={() => (
              <View style={tw`grow`} onStartShouldSetResponder={() => true}>
                {summaries[tab].length > 0 ? (
                  <SectionList
                    contentContainerStyle={[
                      tw`bg-transparent py-7`,
                      isLoading && tw`opacity-60`,
                    ]}
                    onRefresh={refetch}
                    refreshing={false}
                    showsVerticalScrollIndicator={false}
                    sections={getCategories(summaries[tab])}
                    renderSectionHeader={SectionHeader}
                    renderSectionFooter={() => (
                      <View style={tw`bg-transparent h-7`} />
                    )}
                    renderItem={TradeItem}
                    ItemSeparatorComponent={() => (
                      <View
                        onStartShouldSetResponder={() => true}
                        style={tw`h-6`}
                      />
                    )}
                  />
                ) : (
                  <TradePlaceholders tab={tab} />
                )}
              </View>
            )}
          />
        ))}
      </YourTradesTab.Navigator>
    </Screen>
  );
};

function TabBarBadge({
  summaries,
}: {
  summaries: (OfferSummary | ContractSummary)[];
}) {
  const notifications = useMemo(
    () =>
      summaries.reduce((acc, curr) => {
        if ("unreadMessages" in curr && curr.unreadMessages) {
          acc += curr.unreadMessages;
        }
        return acc;
      }, 0),
    [summaries],
  );
  return <NotificationBubble notifications={notifications} />;
}

function YourTradesHeader() {
  const navigation = useStackNavigation();
  const onPress = () => {
    navigation.navigate("exportTradeHistory");
  };
  return (
    <Header
      title={i18n("yourTrades.title")}
      icons={[
        {
          ...headerIcons.share,
          onPress,
          accessibilityHint: `${i18n("goTo")} ${i18n("exportTradeHistory.title")}`,
        },
      ]}
      hideGoBackButton
    />
  );
}

type SectionHeaderProps = {
  section: SectionListData<
    OfferSummary | ContractSummary,
    { title: string; data: (OfferSummary | ContractSummary)[] }
  >;
};
export function SectionHeader({
  section: { title, data },
}: SectionHeaderProps) {
  return data.length !== 0 && title !== "priority" ? (
    <LinedText style={tw`pb-7 bg-transparent`}>
      <PeachText style={tw`text-black-50`}>
        {i18n(`yourTrades.${title}`)}
      </PeachText>
    </LinedText>
  ) : null;
}
