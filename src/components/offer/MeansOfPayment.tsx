import { useMemo, useState } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { getCurrencies } from "../../utils/paymentMethod/getCurrencies";
import { isCashTrade } from "../../utils/paymentMethod/isCashTrade";
import { useCashPaymentMethodName } from "../matches/useCashPaymentMethodName";
import { PeachText } from "../text/PeachText";

type Props = {
  meansOfPayment: MeansOfPayment;
  style?: StyleProp<ViewStyle>;
};

export function MeansOfPayment({ meansOfPayment, style }: Props) {
  const currencies = getCurrencies(meansOfPayment);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  return (
    <View style={[tw`gap-2`, style]}>
      <CurrencySelection
        currencies={currencies}
        selected={selectedCurrency}
        select={setSelectedCurrency}
      />
      <View style={tw`flex-row flex-wrap items-center justify-center gap-1`}>
        {meansOfPayment[selectedCurrency]?.map((p) => (
          <PaymentMethod key={`buyOfferMethod-${p}`} paymentMethod={p} />
        ))}
      </View>
    </View>
  );
}

type PaymentMethodProps = {
  paymentMethod: PaymentMethod;
};

function PaymentMethod({ paymentMethod }: PaymentMethodProps) {
  const { isDarkMode } = useThemeStore();
  const name = useMemo(
    () =>
      paymentMethod ? i18n(`paymentMethod.${paymentMethod}`) : paymentMethod,
    [paymentMethod],
  );
  return (
    <View
      style={[
        tw`flex-row items-center px-2 border rounded-lg button-medium`,
        tw.style(isDarkMode ? "border-primary-main" : "border-black-100"),
      ]}
    >
      {isCashTrade(paymentMethod) ? (
        <CashPaymentMethodName paymentMethod={paymentMethod} />
      ) : (
        <PeachText
          style={tw.style(
            "button-medium",
            isDarkMode ? "text-primary-main" : "text-black-100",
          )}
        >
          {name}
        </PeachText>
      )}
    </View>
  );
}

function CashPaymentMethodName({
  paymentMethod,
}: {
  paymentMethod: `cash.${string}`;
}) {
  const { isDarkMode } = useThemeStore();
  const value = useCashPaymentMethodName(paymentMethod);
  return (
    <PeachText
      style={tw.style(
        "button-medium",
        isDarkMode ? "text-primary-main" : "text-black-100",
      )}
    >
      {value}
    </PeachText>
  );
}

type CurrencySelectionProps = {
  currencies: Currency[];
  selected: Currency;
  select: (currency: Currency) => void;
};

function CurrencySelection({
  currencies,
  selected,
  select,
}: CurrencySelectionProps) {
  const { isDarkMode } = useThemeStore();
  return (
    <View style={tw`flex-row flex-wrap justify-center`}>
      {currencies.map((currency) => (
        <TouchableOpacity
          key={`currency-selection-${currency}`}
          style={tw`items-center grow min-w-1/8 max-w-1/4`}
          onPress={() => select(currency)}
        >
          <PeachText
            numberOfLines={1}
            style={[
              tw`text-center button-large text-black-50`,
              currency === selected &&
                tw.style(isDarkMode ? "text-primary-main" : "text-black-100"),
            ]}
          >
            {currency}
          </PeachText>
          {currency === selected && (
            <View
              style={[
                tw`w-full h-2px bg-black-100 rounded-1px`,
                tw.style(isDarkMode ? "bg-primary-main" : "bg-black-100"),
              ]}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}
