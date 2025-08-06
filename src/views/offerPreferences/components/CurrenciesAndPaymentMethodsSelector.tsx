import { useMemo } from "react";
import { FlatList, Switch, View } from "react-native";
import { PeachText } from "../../../components/text/PeachText";
import { CURRENCIES, PAYMENTMETHODINFOS } from "../../../paymentMethods";

export function CurrenciesAndPaymentMethodsSelector({
  selectedPaymentMethods,
  setSelectedPaymentMethods,
  selectedCurrencies,
  setSelectedCurrencies,
}: {
  selectedPaymentMethods: PaymentMethodInfo[];
  setSelectedPaymentMethods: (paymentMethodList: PaymentMethodInfo[]) => void;
  selectedCurrencies: Currency[];
  setSelectedCurrencies: (currencyList: Currency[]) => void;
}) {
  const filteredPaymentMethods = useMemo(() => {
    if (selectedCurrencies.length === 0) return PAYMENTMETHODINFOS;

    return PAYMENTMETHODINFOS.filter((method: PaymentMethodInfo) =>
      method.currencies.some((c) => selectedCurrencies.includes(c)),
    );
  }, [selectedCurrencies]);

  const filteredCurrencies = useMemo(() => {
    if (selectedPaymentMethods.length === 0) return CURRENCIES;

    const allCurrencies = selectedPaymentMethods.flatMap((pm) => pm.currencies);
    return CURRENCIES.filter((currency) => allCurrencies.includes(currency));
  }, [selectedPaymentMethods]);

  return (
    <>
      <CurrenciesSelector
        filteredCurrencies={filteredCurrencies}
        selectedCurrencies={selectedCurrencies}
        setSelectedCurrencies={setSelectedCurrencies}
      />
      <PaymentMethodsSelector
        filteredPaymentMethods={filteredPaymentMethods}
        selectedPaymentMethods={selectedPaymentMethods}
        setSelectedPaymentMethods={setSelectedPaymentMethods}
      />
    </>
  );
}

function CurrenciesSelector({
  filteredCurrencies,
  selectedCurrencies,
  setSelectedCurrencies,
}: {
  filteredCurrencies: Currency[];
  selectedCurrencies: Currency[];
  setSelectedCurrencies: (currencies: Currency[]) => void;
}) {
  const toggleCurrency = (currency: Currency) => {
    const updated = selectedCurrencies.includes(currency)
      ? selectedCurrencies.filter((c) => c !== currency)
      : [...selectedCurrencies, currency];

    setSelectedCurrencies(updated);
  };

  return (
    <>
      <PeachText>Currencies</PeachText>
      <FlatList
        data={filteredCurrencies}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View>
            <PeachText>{item}</PeachText>
            <Switch
              value={selectedCurrencies.includes(item)}
              onValueChange={() => toggleCurrency(item)}
            />
          </View>
        )}
      />
    </>
  );
}

function PaymentMethodsSelector({
  filteredPaymentMethods,
  selectedPaymentMethods,
  setSelectedPaymentMethods,
}: {
  filteredPaymentMethods: PaymentMethodInfo[];
  selectedPaymentMethods: PaymentMethodInfo[];
  setSelectedPaymentMethods: (paymentMethods: PaymentMethodInfo[]) => void;
}) {
  const togglePaymentMethod = (paymentMethod: PaymentMethodInfo) => {
    const updated = selectedPaymentMethods.includes(paymentMethod)
      ? selectedPaymentMethods.filter((c) => c !== paymentMethod)
      : [...selectedPaymentMethods, paymentMethod];

    setSelectedPaymentMethods(updated);
  };

  return (
    <>
      <PeachText>Payment Methods</PeachText>
      <FlatList
        data={filteredPaymentMethods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <PeachText>{item.id}</PeachText>
            <Switch
              value={selectedPaymentMethods.includes(item)}
              onValueChange={() => togglePaymentMethod(item)}
            />
          </View>
        )}
      />
    </>
  );
}
