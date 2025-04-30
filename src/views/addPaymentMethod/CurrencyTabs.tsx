import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useShallow } from "zustand/shallow";
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

const currencyTabs = [
  "europe",
  "latinAmerica",
  "africa",
  "asia",
  "oceania",
  "northAmerica",
  "other",
] as const;

export const CurrencyTabs = (props: Props) => {
  const [preferredCurrencyType, setPreferredCurrencyType] = useOfferPreferences(
    useShallow((state) => [
      state.preferredCurrenyType,
      state.setPreferredCurrencyType,
    ]),
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
        sceneStyle: [tw`pb-2 px-sm`, tw`md:px-md`],
      }}
    >
      {currencyTabs.map((currencyTab) => (
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
