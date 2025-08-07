import { View } from "react-native";
import { shallow } from "zustand/shallow";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { PremiumInput } from "../../components/PremiumInput";
import { Screen } from "../../components/Screen";
import { useOfferPreferences } from "../../store/offerPreferenes";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { AmountSelectorComponent } from "../offerPreferences/components/AmountSelectorComponent";
import { CurrenciesAndPaymentMethodsSelector } from "../offerPreferences/components/CurrenciesAndPaymentMethodsSelector";

export function ExpressSellFilters() {
  const title = i18n("offer.buy.filter");

  const [
    expressSellFilterByCurrencyList,
    setExpressSellFilterByCurrencyList,
    expressSellFilterByPaymentMethodList,
    setExpressSellFilterByPaymentMethodList,
  ] = useOfferPreferences((state) => [
    state.expressSellFilterByCurrencyList,
    state.setExpressSellFilterByCurrencyList,
    state.expressSellFilterByPaymentMethodList,
    state.setExpressSellFilterByPaymentMethodList,
  ]);

  return (
    <Screen header={<Header title={title} />}>
      <PeachScrollView contentContainerStyle={tw`grow`} contentStyle={tw`grow`}>
        <AmountSelector />
        <Premium />
        <CurrenciesAndPaymentMethodsSelector
          selectedCurrencies={expressSellFilterByCurrencyList}
          setSelectedCurrencies={setExpressSellFilterByCurrencyList}
          selectedPaymentMethods={expressSellFilterByPaymentMethodList}
          setSelectedPaymentMethods={setExpressSellFilterByPaymentMethodList}
        />
      </PeachScrollView>
    </Screen>
  );
}

function Premium() {
  const [premium, setPremium] = useOfferPreferences((state) => [
    state.expressSellFilterMinPremium,
    state.setExpressSellFilterMinPremium,
  ]);

  return (
    <View style={tw`self-stretch gap-1`}>
      <PremiumInput
        premium={premium}
        setPremium={setPremium}
        incrementBy={1}
        incrementType="minPremium"
      />
    </View>
  );
}

function AmountSelector() {
  const [expressSellFilterByAmountRange, setExpressSellFilterByAmountRange] =
    useOfferPreferences(
      (state) => [
        state.expressSellFilterByAmountRange,
        state.setExpressSellFilterByAmountRange,
      ],
      shallow,
    );

  return (
    <AmountSelectorComponent
      setIsSliding={() => {}}
      range={expressSellFilterByAmountRange}
      setRange={setExpressSellFilterByAmountRange}
      isSell
    />
  );
}
