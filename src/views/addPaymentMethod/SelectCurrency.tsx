import { useState } from "react";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { CurrencyTabs } from "./CurrencyTabs";
import { usePaymentMethodLabel } from "./hooks";

export const SelectCurrency = () => {
  const navigation = useStackNavigation();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("EUR");

  const { origin } = useRoute<"selectCurrency">().params;

  const getPaymentMethodLabel = usePaymentMethodLabel();

  const goToPaymentMethodForm = (type: PaymentMethod) => {
    const label = getPaymentMethodLabel(type);
    navigation.navigate("paymentMethodForm", {
      paymentData: { type, label, currencies: [selectedCurrency] },
      origin,
    });
  };

  const next = () => {
    if (selectedCurrency === "USDT") return goToPaymentMethodForm("liquid");
    if (selectedCurrency === "SAT") return goToPaymentMethodForm("lnurl");
    return navigation.navigate("selectPaymentMethod", {
      selectedCurrency,
      origin,
    });
  };

  return (
    <Screen style={tw`px-0`} header={i18n("selectCurrency.title")}>
      <CurrencyTabs
        currency={selectedCurrency}
        setCurrency={setSelectedCurrency}
      />
      <Button style={tw`self-center`} onPress={next}>
        {i18n("next")}
      </Button>
    </Screen>
  );
};
