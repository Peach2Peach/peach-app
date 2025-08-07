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

export function ExpressBuyFilters() {
  const title = i18n("offer.sell.filter");

  const [
    expressBuyFilterByCurrencyList,
    setExpressBuyFilterByCurrencyList,
    expressBuyFilterByPaymentMethodList,
    setExpressBuyFilterByPaymentMethodList,
  ] = useOfferPreferences((state) => [
    state.expressBuyFilterByCurrencyList,
    state.setExpressBuyFilterByCurrencyList,
    state.expressBuyFilterByPaymentMethodList,
    state.setExpressBuyFilterByPaymentMethodList,
  ]);

  return (
    <Screen header={<Header title={title} />}>
      <PeachScrollView contentContainerStyle={tw`grow`} contentStyle={tw`grow`}>
        <AmountSelector />
        <Premium />
        <CurrenciesAndPaymentMethodsSelector
          selectedCurrencies={expressBuyFilterByCurrencyList}
          setSelectedCurrencies={setExpressBuyFilterByCurrencyList}
          selectedPaymentMethods={expressBuyFilterByPaymentMethodList}
          setSelectedPaymentMethods={setExpressBuyFilterByPaymentMethodList}
        />
      </PeachScrollView>
    </Screen>
  );
}

function Premium() {
  const [premium, setPremium] = useOfferPreferences((state) => [
    state.expressBuyFilterMaxPremium,
    state.setExpressBuyFilterMaxPremium,
  ]);

  return (
    <View style={tw`self-stretch gap-1`}>
      <PremiumInput
        premium={premium}
        setPremium={setPremium}
        incrementBy={1}
        incrementType="maxPremium"
      />
    </View>
  );
}

function AmountSelector() {
  const [expressBuyFilterByAmountRange, setExpressBuyFilterByAmountRange] =
    useOfferPreferences(
      (state) => [
        state.expressBuyFilterByAmountRange,
        state.setExpressBuyFilterByAmountRange,
      ],
      shallow,
    );

  return (
    <AmountSelectorComponent
      setIsSliding={() => {}}
      range={expressBuyFilterByAmountRange}
      setRange={setExpressBuyFilterByAmountRange}
    />
  );
}
