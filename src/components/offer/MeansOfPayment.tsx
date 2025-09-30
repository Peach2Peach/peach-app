import { useMemo, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { getCurrencies } from "../../utils/paymentMethod/getCurrencies";
import { isCashTrade } from "../../utils/paymentMethod/isCashTrade";
import { useCashPaymentMethodName } from "../matches/useCashPaymentMethodName";
import { CurrencySelection } from "../navigation/CurrencySelection";
import { PeachText } from "../text/PeachText";

type Props = {
  meansOfPayment: MeansOfPayment;
  style?: StyleProp<ViewStyle>;
  setDisplayedCurrency?: Function;
};

export function MeansOfPayment({
  meansOfPayment,
  style,
  setDisplayedCurrency,
}: Props) {
  const currencies = getCurrencies(meansOfPayment);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  return (
    <View style={style}>
      <CurrencySelection
        currencies={currencies}
        selected={selectedCurrency}
        select={(a) => {
          console.log("bottom", a, setDisplayedCurrency);
          setSelectedCurrency(a);
          if (setDisplayedCurrency !== undefined) {
            setDisplayedCurrency(a);
          }
        }}
      />
      <View style={tw`flex-row flex-wrap items-center justify-center`}>
        {meansOfPayment[selectedCurrency]?.map((p) => (
          <PaymentMethod
            key={`buyOfferMethod-${p}`}
            paymentMethod={p}
            style={tw`m-2`}
          />
        ))}
      </View>
    </View>
  );
}

type PaymentMethodProps = {
  paymentMethod: PaymentMethod;
  style: StyleProp<ViewStyle>;
};

function PaymentMethod({ paymentMethod, style }: PaymentMethodProps) {
  const { isDarkMode } = useThemeStore();
  const name = useMemo(
    () =>
      paymentMethod ? i18n(`paymentMethod.${paymentMethod}`) : paymentMethod,
    [paymentMethod],
  );
  return (
    <View
      style={[
        tw`flex-row items-center px-3 border rounded-lg button-medium`,
        tw.style(isDarkMode ? "border-primary-main" : "border-black-100"),
        style,
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
