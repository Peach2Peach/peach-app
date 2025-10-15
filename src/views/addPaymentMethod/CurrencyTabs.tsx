import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { shallow } from "zustand/shallow";
import { Currency } from "../../../peach-api/src/@types/global";
import { fullScreenTabNavigationScreenOptions } from "../../constants";
import { useOfferPreferences } from "../../store/offerPreferenes";
import { CurrencyType } from "../../store/offerPreferenes/types";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { Currencies } from "./Currencies";
import { defaultCurrencies } from "./constants";

type Props = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
};

const CurrencyTab = createMaterialTopTabNavigator();

const currencyTabs: CurrencyType[] = [
  "africa",
  "asia",
  "latinAmerica",
  "middleEast",
  "northAmerica",
  "oceania",
];

export const CurrencyTabs = (props: Props) => {
  const [preferredCurrencyType, setPreferredCurrencyType] = useOfferPreferences(
    (state) => [state.preferredCurrenyType, state.setPreferredCurrencyType],
    shallow,
  );

  return (
    <CurrencyTab.Navigator
      initialRouteName={preferredCurrencyType.toString()}
      screenListeners={{
        focus: (e) => {
          const currencyType = CurrencyType.parse(e.target?.split("-")[0]);
          setPreferredCurrencyType(currencyType);
          props.setCurrency(defaultCurrencies[currencyType]);
        },
      }}
      screenOptions={{
        ...fullScreenTabNavigationScreenOptions,
        tabBarLabelStyle: tw`capitalize input-title`,
        tabBarScrollEnabled: true,
        sceneStyle: tw`pb-2 px-sm md:px-md`,
      }}
    >
      <CurrencyTab.Screen
        name={"europe"}
        options={{ title: i18n("europe") }}
        children={() => <Currencies type={"europe"} {...props} />}
      />
      <CurrencyTab.Screen
        name={"global"}
        options={{ title: i18n("global") }}
        children={() => <Currencies type={"global"} {...props} />}
      />
      {currencyTabs
        .sort((a, b) => i18n(a).localeCompare(i18n(b)))
        .map((currencyTab) => (
          <CurrencyTab.Screen
            key={currencyTab}
            name={currencyTab}
            options={{ title: i18n(currencyTab) }}
            children={() => <Currencies type={currencyTab} {...props} />}
          />
        ))}
    </CurrencyTab.Navigator>
  );
};
