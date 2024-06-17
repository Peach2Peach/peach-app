import { useTranslate } from "@tolgee/react";
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
import { headerIcons } from "../../utils/layout/headerIcons";
import { countrySupportsCurrency } from "../../utils/paymentMethod/countrySupportsCurrency";
import { getPaymentMethodInfo } from "../../utils/paymentMethod/getPaymentMethodInfo";
import { usePaymentMethodLabel } from "./hooks";

export const SelectCountry = () => {
  const { origin, selectedCurrency } = useRoute<"selectCountry">().params;
  const navigation = useStackNavigation();
  const [selectedCountry, setCountry] = useState<PaymentMethodCountry>();
  const setPopup = useSetPopup();
  const { t } = useTranslate();

  const countries = useMemo(
    () =>
      getPaymentMethodInfo("giftCard.amazon")
        ?.countries?.filter(countrySupportsCurrency(selectedCurrency))
        .map((c) => ({
          value: c,
          // @ts-ignore
          display: t(`country.${c}`),
        })),
    [selectedCurrency, t],
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
          title={t("paymentMethod.giftCard.countrySelect.title", {
            ns: "paymentMethod",
          })}
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
        {t("next")}
      </Button>
    </Screen>
  );
};
