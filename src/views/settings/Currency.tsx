import { useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { RadioButtons } from "../../components/inputs/RadioButtons";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import tw from "../../styles/tailwind";
import { uniqueArray } from "../../utils/array/uniqueArray";
import i18n from "../../utils/i18n";
import { usePaymentMethods } from "../addPaymentMethod/usePaymentMethodInfo";
import { LoadingScreen } from "../loading/LoadingScreen";

export const Currency = () => {
  const navigation = useStackNavigation();
  const [displayCurrency, setDisplayCurrency] = useSettingsStore(
    useShallow((state) => [state.displayCurrency, state.setDisplayCurrency]),
  );

  const goBack = () => {
    navigation.goBack();
  };

  const { data: paymentMethods } = usePaymentMethods();
  const allCurrencies = useMemo(
    () =>
      paymentMethods
        ?.reduce((arr: Currency[], info) => arr.concat(info.currencies), [])
        .filter(uniqueArray),
    [paymentMethods],
  );
  if (!allCurrencies) return <LoadingScreen />;

  return (
    <Screen header={i18n("currency")}>
      <PeachScrollView
        style={tw`mb-4`}
        contentContainerStyle={[tw`justify-center py-4 grow`, tw`md:py-8`]}
      >
        <RadioButtons
          selectedValue={displayCurrency}
          items={allCurrencies
            .sort((a, b) =>
              i18n(`currency.${a}`).localeCompare(i18n(`currency.${b}`)),
            )
            .map((c) => ({
              value: c,
              display: i18n(`currency.${c}`),
            }))}
          onButtonPress={setDisplayCurrency}
        />
      </PeachScrollView>
      <Button onPress={goBack} style={tw`self-center`}>
        {i18n("confirm")}
      </Button>
    </Screen>
  );
};
