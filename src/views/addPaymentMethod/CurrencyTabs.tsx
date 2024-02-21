import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { shallow } from "zustand/shallow";
import { fullScreenTabNavigationScreenOptions } from "../../constants";
import { useOfferPreferences } from "../../store/offerPreferenes";
import { CurrencyType } from "../../store/offerPreferenes/types";
import tw from "../../styles/tailwind";
import { Currencies } from "./Currencies";
import { defaultCurrencies } from "./constants";
import { useTranslate } from "@tolgee/react";

type Props = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
};

const CurrencyTab = createMaterialTopTabNavigator();

const currencyTabs = ["europe", "latinAmerica", "africa", "other"] as const;

export const CurrencyTabs = (props: Props) => {
  const { t } = useTranslate("global");
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
      sceneContainerStyle={[tw`pb-2 px-sm`, tw`md:px-md`]}
      screenOptions={{
        ...fullScreenTabNavigationScreenOptions,
        tabBarLabelStyle: tw`capitalize input-title`,
        tabBarScrollEnabled: true,
      }}
    >
      {currencyTabs.map((currencyTab) => (
        <CurrencyTab.Screen
          key={currencyTab}
          name={currencyTab}
          options={{ title: t(currencyTab) }}
          children={() => <Currencies type={currencyTab} {...props} />}
        />
      ))}
    </CurrencyTab.Navigator>
  );
};
