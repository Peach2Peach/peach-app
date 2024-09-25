import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { memo, useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { setNumber } from "rn-notification-badge";
import { ContractSummary } from "../../../peach-api/src/@types/contract";
import { OfferSummary, TradeStatus } from "../../../peach-api/src/@types/offer";
import { IconType } from "../../assets/icons";
import { Icon } from "../../components/Icon";
import { NotificationBubble } from "../../components/bubble/NotificationBubble";
import { PeachText } from "../../components/text/PeachText";
import { useContractSummaries } from "../../hooks/query/useContractSummaries";
import { useOfferSummaries } from "../../hooks/query/useOfferSummaries";
import { useTradeSummaries } from "../../hooks/query/useTradeSummaries";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { isIOS } from "../../utils/system/isIOS";
import { HomeTabName, homeTabNames, homeTabs } from "./homeTabNames";

const Tab = createBottomTabNavigator();

export function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="home"
      sceneContainerStyle={tw`flex-1`}
      tabBar={() => <Footer />}
      id="homeNavigator"
    >
      {homeTabNames.map((name) => (
        <Tab.Screen
          {...{ name }}
          key={`homeTab-${name}`}
          component={homeTabs[name]}
        />
      ))}
    </Tab.Navigator>
  );
}
type FooterItemBaseProps = {
  id: HomeTabName;
  iconId: IconType;
  notificationBubble?: JSX.Element;
  onPress?: () => void;
  active: boolean;
};

const FooterItemBase = memo(
  ({
    id,
    iconId,
    notificationBubble,
    onPress,
    active,
  }: FooterItemBaseProps) => {
    const navigation = useStackNavigation();
    const onItemPress = () => {
      if (onPress) onPress();
      else navigation.navigate("homeScreen", { screen: id });
    };
    const colorTheme = tw.color(active ? "black-100" : "black-65");
    const size = tw`w-6 h-6`;
    return (
      <TouchableOpacity
        onPress={onItemPress}
        style={tw`items-center flex-1 gap-2px`}
      >
        <View style={size}>
          <Icon id={iconId} style={size} color={colorTheme} />
          {notificationBubble}
        </View>
        <PeachText
          style={[
            { color: colorTheme },
            id === "home" && active && tw`text-primary-main`,
            tw`leading-relaxed text-center subtitle-1 text-9px`,
          ]}
        >
          {i18n(`footer.${id}`)}
        </PeachText>
      </TouchableOpacity>
    );
  },
);

const HomeFooterItem = memo(({ active }: { active: boolean }) => (
  <FooterItemBase
    id="home"
    iconId={active ? "home" : "homeUnselected"}
    active={active}
  />
));

const FooterItem = memo(
  ({ id, active }: { id: HomeTabName; active: boolean }) => (
    <FooterItemBase id={id} iconId={id} active={active} />
  ),
);

const statusWithRequiredAction: TradeStatus[] = [
  "fundEscrow",
  "fundingAmountDifferent",
  "hasMatchesAvailable",
  "refundAddressRequired",
  "refundTxSignatureRequired",
  "dispute",
  "rateUser",
  "confirmCancelation",
  "refundOrReviveRequired",
];

const hasRequiredAction = ({
  type,
  tradeStatus,
}: OfferSummary | ContractSummary) =>
  statusWithRequiredAction.includes(tradeStatus) ||
  (type === "bid" && tradeStatus === "paymentRequired") ||
  (type === "ask" && tradeStatus === "confirmPaymentRequired");

const YourTradesFooterItem = memo(({ active }: { active: boolean }) => {
  const navigation = useStackNavigation();
  const { summaries } = useTradeSummaries();
  const { offers } = useOfferSummaries();
  const { contracts } = useContractSummaries();
  const notifications = useMemo(() => {
    const offersWithAction = offers
      .filter(({ contractId }) => !contractId)
      .filter((offer) => hasRequiredAction(offer)).length;
    const contractsWithAction = contracts.filter(
      (contract) => hasRequiredAction(contract) || contract.unreadMessages > 0,
    ).length;
    if (isIOS()) setNumber(offersWithAction + contractsWithAction);
    return offersWithAction + contractsWithAction;
  }, [offers, contracts]);

  const onPress = () => {
    const destinationTab =
      summaries["yourTrades.buy"].length === 0
        ? summaries["yourTrades.sell"].length === 0
          ? summaries["yourTrades.history"].length === 0
            ? "yourTrades.buy"
            : "yourTrades.history"
          : "yourTrades.sell"
        : "yourTrades.buy";

    navigation.navigate("homeScreen", {
      screen: "yourTrades",
      params: { tab: destinationTab },
    });
  };

  return (
    <FooterItemBase
      id="yourTrades"
      iconId="yourTrades"
      notificationBubble={
        <NotificationBubble
          notifications={notifications}
          style={tw`absolute -right-2 -top-2`}
        />
      }
      onPress={onPress}
      active={active}
    />
  );
});
const FOOTER_ITEMS = {
  home: ({ active }: { active: boolean }) => <HomeFooterItem active={active} />,
  yourTrades: ({ active }: { active: boolean }) => (
    <YourTradesFooterItem active={active} />
  ),
  wallet: ({ active }: { active: boolean }) => (
    <FooterItem id="wallet" active={active} />
  ),
  settings: ({ active }: { active: boolean }) => (
    <FooterItem id="settings" active={active} />
  ),
};

function Footer() {
  const { bottom } = useSafeAreaInsets();
  const currentPage = useRoute<"homeScreen">().params?.screen ?? "home";
  return (
    <View
      style={[
        tw`flex-row items-center self-stretch justify-between pt-2 bg-primary-background-main`,
        tw`md:pt-4`,
        { paddingBottom: bottom },
      ]}
    >
      {homeTabNames.map((name) => {
        const Item = FOOTER_ITEMS[name];
        return <Item key={name} active={currentPage === name} />;
      })}
    </View>
  );
}
