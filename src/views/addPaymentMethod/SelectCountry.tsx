import { useMemo, useState } from "react";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { RadioButtons } from "../../components/inputs/RadioButtons";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { HelpPopup } from "../../popups/HelpPopup";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { countryCurrencyMap } from "../../utils/paymentMethod/countrySupportsCurrency";
import { usePaymentMethodLabel } from "./hooks";
import { usePaymentMethodInfo } from "./usePaymentMethodInfo";

export const SelectCountry = () => {
  const { origin, selectedCurrency } = useRoute<"selectCountry">().params;
  const navigation = useStackNavigation();
  const [selectedCountry, setCountry] = useState<PaymentMethodCountry>();
  const setPopup = useSetPopup();
  const { data: paymentMethodInfo } = usePaymentMethodInfo("giftCard.amazon");

  const countries = useMemo(
    () =>
      paymentMethodInfo?.countries
        ?.filter(
          (country) =>
            !!countryCurrencyMap[selectedCurrency]?.includes(country),
        )
        .map((c) => ({
          value: c,
          display: i18n(`country.${c}`),
        })),
    [paymentMethodInfo?.countries, selectedCurrency],
  );

  const getPaymentMethodLabel = usePaymentMethodLabel();

  const goToPaymentMethodForm = () => {
    if (!selectedCountry) return;
    const type = `giftCard.amazon.${selectedCountry}` satisfies PaymentMethod;
    const label = getPaymentMethodLabel(type);

    navigation.navigate("paymentMethodForm", {
      paymentData: {
        type,
        label,
        currencies: [selectedCurrency],
        country: selectedCountry,
      },
      origin,
    });
  };

  const showHelp = () => setPopup(<HelpPopup id="giftCards" />);

  return (
    <Screen
      header={
        <Header
          title={i18n("paymentMethod.giftCard.countrySelect.title")}
          icons={[{ ...headerIcons.help, onPress: showHelp }]}
        />
      }
    >
      <PeachScrollView
        contentContainerStyle={[tw`justify-center py-4 grow`, tw`md:py-8`]}
      >
        {!!countries && (
          <RadioButtons
            items={countries}
            selectedValue={selectedCountry}
            onButtonPress={setCountry}
          />
        )}
      </PeachScrollView>
      <Button
        style={tw`self-center mt-2`}
        disabled={!selectedCountry}
        onPress={goToPaymentMethodForm}
      >
        {i18n("next")}
      </Button>
    </Screen>
  );
};
