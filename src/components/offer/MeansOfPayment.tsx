import { useMemo, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import tw from "../../styles/tailwind";
import { getCurrencies } from "../../utils/paymentMethod/getCurrencies";
import { isCashTrade } from "../../utils/paymentMethod/isCashTrade";
import { useCashPaymentMethodName } from "../matches/useCashPaymentMethodName";
import { CurrencySelection } from "../navigation/CurrencySelection";
import { PeachText } from "../text/PeachText";
import { useTranslate } from "@tolgee/react";

type Props = {
  meansOfPayment: MeansOfPayment;
  style?: StyleProp<ViewStyle>;
};

export function MeansOfPayment({ meansOfPayment, style }: Props) {
  const currencies = getCurrencies(meansOfPayment);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  return (
    <View style={style}>
      <CurrencySelection
        currencies={currencies}
        selected={selectedCurrency}
        select={setSelectedCurrency}
      />
      <View style={tw`flex-row flex-wrap items-center justify-center`}>
        {meansOfPayment[selectedCurrency]?.map((p) => (
          <PaymentMethod
            key={`buyOfferMethod-${p}`}
            paymentMethod={p}
            style={tw`m-1`}
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
  const { t } = useTranslate("paymentMethod");
  const name = useMemo(
    () => (paymentMethod ? t(`paymentMethod.${paymentMethod}`) : paymentMethod),
    [paymentMethod, t],
  );
  return (
    <View
      style={[
        tw`flex-row items-center px-2 border rounded-lg border-black-100 button-medium`,
        style,
      ]}
    >
      {isCashTrade(paymentMethod) ? (
        <CashPaymentMethodName paymentMethod={paymentMethod} />
      ) : (
        <PeachText style={tw`button-medium`}>{name}</PeachText>
      )}
    </View>
  );
}

function CashPaymentMethodName({
  paymentMethod,
}: {
  paymentMethod: `cash.${string}`;
}) {
  const value = useCashPaymentMethodName(paymentMethod);
  return <PeachText style={tw`button-medium`}>{value}</PeachText>;
}
