import { useTranslate } from "@tolgee/react";
import { shallow } from "zustand/shallow";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { RadioButtons } from "../../components/inputs/RadioButtons";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { CURRENCIES } from "../../paymentMethods";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import tw from "../../styles/tailwind";

export const Currency = () => {
  const { t } = useTranslate("global");
  const navigation = useStackNavigation();
  const [displayCurrency, setDisplayCurrency] = useSettingsStore(
    (state) => [state.displayCurrency, state.setDisplayCurrency],
    shallow,
  );

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <Screen header={t("currency")}>
      <PeachScrollView
        style={tw`mb-4`}
        contentContainerStyle={[tw`justify-center py-4 grow`, tw`md:py-8`]}
      >
        <RadioButtons
          selectedValue={displayCurrency}
          items={CURRENCIES.map((c) => ({
            value: c,
            // @ts-ignore
            display: t(`currency.${c}`),
          }))}
          onButtonPress={setDisplayCurrency}
        />
      </PeachScrollView>
      <Button onPress={goBack} style={tw`self-center`}>
        {t("confirm")}
      </Button>
    </Screen>
  );
};
