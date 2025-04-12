import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Screen } from "../../components/Screen";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { fullScreenTabNavigationScreenOptions } from "../../constants";
import { HelpPopup } from "../../popups/HelpPopup";
import tw from "../../styles/tailwind";
import { headerIcons } from "../../utils/layout/headerIcons";
import { CreateBuyOffer } from "../offerPreferences/CreateBuyOffer";
import { BuyBitcoinHeader } from "../offerPreferences/components/BuyBitcoinHeader";
import { ExpressBuy } from "./ExpressBuy";
import i18n from "../../utils/i18n";

const BuyTab = createMaterialTopTabNavigator();

export function Buy() {
  return (
    <Screen style={tw`px-0`} header={<BuyHeader />}>
      <BuyTab.Navigator
        initialRouteName="expressBuy"
        screenOptions={{
          ...fullScreenTabNavigationScreenOptions,
          swipeEnabled: false,
        }}
        sceneContainerStyle={[tw`px-sm`, tw`md:px-md`]}
      >
        <BuyTab.Screen
          name="expressBuy"
          options={{
            title: i18n("home.expressBuy"),
          }}
          component={ExpressBuy}
        />
        <BuyTab.Screen
          name="createOffer"
          options={{
            title: i18n("home.createBuyOffer"),
          }}
          component={CreateBuyOffer}
        />
      </BuyTab.Navigator>
    </Screen>
  );
}

function BuyHeader() {
  const setPopup = useSetPopup();
  const showHelp = () => setPopup(<HelpPopup id="buyingBitcoin" />);
  return (
    <BuyBitcoinHeader icons={[{ ...headerIcons.help, onPress: showHelp }]} />
  );
}
